
```bash
#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────────────────────
#  EDIT THESE (or pass as env vars on the command line)
# ──────────────────────────────────────────────────────────────────────────────
REGION="${REGION:-eu-central-1}"

# SSO (IAM Identity Center) profile you want to create/use
PROFILE="${PROFILE:-projektbezkodu-dev}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-123456789012}"    # target account for ECR login test
AWS_ROLE_NAME="${AWS_ROLE_NAME:-AdministratorAccess}"# role name assigned to your user/group

SSO_SESSION_NAME="${SSO_SESSION_NAME:-projektbezkodu}"
SSO_START_URL="${SSO_START_URL:-https://example.awsapps.com/start}"
SSO_REGION="${SSO_REGION:-$REGION}"

# Set USE_SSO=false to skip SSO profile creation (you can use 'aws configure' later)
USE_SSO="${USE_SSO:-true}"

# ──────────────────────────────────────────────────────────────────────────────
#  Helpers
# ──────────────────────────────────────────────────────────────────────────────
log() { printf "\n\033[1;32m▶ %s\033[0m\n" "$*"; }
warn() { printf "\n\033[1;33m⚠ %s\033[0m\n" "$*"; }
err() { printf "\n\033[1;31m✖ %s\033[0m\n" "$*" >&2; }

if [[ $EUID -ne 0 ]]; then SUDO="sudo"; else SUDO=""; fi
source /etc/os-release || { err "Cannot detect OS."; exit 1; }

PKG=""
if command -v apt-get >/dev/null 2>&1; then PKG="apt"
elif command -v dnf >/dev/null 2>&1; then PKG="dnf"
else err "Unsupported distro (need apt or dnf)."; exit 1
fi

# WSL note (Docker Engine usually runs via Docker Desktop; Engine inside WSL is atypical)
if grep -qi microsoft /proc/version 2>/dev/null; then
  warn "WSL detected. Installing Docker Engine inside WSL is uncommon. Consider Docker Desktop + WSL integration."
fi

# ──────────────────────────────────────────────────────────────────────────────
#  Packages: curl, unzip, gnupg, ca-certs, repo helpers
# ──────────────────────────────────────────────────────────────────────────────
install_prereqs() {
  log "Installing prerequisites"
  case "$PKG" in
    apt)
      $SUDO apt-get update -y
      $SUDO apt-get install -y \
        ca-certificates curl unzip gnupg lsb-release software-properties-common
      ;;
    dnf)
      $SUDO dnf -y install ca-certificates curl unzip gnupg2
      # repo helper for Docker/HashiCorp
      $SUDO dnf -y install dnf-plugins-core || true
      ;;
  esac
}

# ──────────────────────────────────────────────────────────────────────────────
#  AWS CLI v2 (official zip installer)
# ──────────────────────────────────────────────────────────────────────────────
install_aws_cli() {
  log "Installing AWS CLI v2"
  local arch=$(uname -m)
  local zip=""
  case "$arch" in
    x86_64)  zip="awscli-exe-linux-x86_64.zip" ;;
    aarch64|arm64) zip="awscli-exe-linux-aarch64.zip" ;;
    *) err "Unsupported CPU arch: $arch"; exit 1 ;;
  esac

  pushd /tmp >/dev/null
  curl -fsSLO "https://awscli.amazonaws.com/${zip}"
  rm -rf aws
  unzip -q "${zip}"
  $SUDO ./aws/install --update
  popd >/dev/null
  aws --version
}

# ──────────────────────────────────────────────────────────────────────────────
#  Terraform (official HashiCorp repo)
# ──────────────────────────────────────────────────────────────────────────────
install_terraform() {
  log "Installing Terraform CLI"
  case "$PKG" in
    apt)
      $SUDO install -m 0755 -d /usr/share/keyrings
      curl -fsSL https://apt.releases.hashicorp.com/gpg | \
        $SUDO gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
      local codename="${VERSION_CODENAME:-${UBUNTU_CODENAME:-}}"
      if [[ -z "$codename" ]]; then
        err "Could not determine distro codename (VERSION_CODENAME). Set UBUNTU_CODENAME or use manual install."
        exit 1
      fi
      echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com ${codename} main" | \
        $SUDO tee /etc/apt/sources.list.d/hashicorp.list >/dev/null
      $SUDO apt-get update -y
      $SUDO apt-get install -y terraform
      ;;
    dnf)
      # Use Fedora repo on Fedora; RHEL-compatible repo on RHEL/Rocky/Alma
      case "$ID" in
        fedora)
          $SUDO dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
          ;;
        rhel|rocky|almalinux|centos|ol)
          $SUDO dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
          ;;
        *)
          warn "Unknown dnf-based distro '$ID'; trying RHEL repo."
          $SUDO dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
          ;;
      esac
      $SUDO dnf -y install terraform
      ;;
  esac
  terraform -version
}

# ──────────────────────────────────────────────────────────────────────────────
#  Docker Engine (official Docker repo)
# ──────────────────────────────────────────────────────────────────────────────
install_docker() {
  log "Installing Docker Engine"
  case "$PKG" in
    apt)
      $SUDO apt-get update -y
      $SUDO apt-get install -y ca-certificates curl gnupg
      $SUDO install -m 0755 -d /etc/apt/keyrings
      curl -fsSL "https://download.docker.com/linux/${ID}/gpg" | \
        $SUDO gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      $SUDO chmod a+r /etc/apt/keyrings/docker.gpg
      local codename="${VERSION_CODENAME:-${UBUNTU_CODENAME:-}}"
      echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/${ID} ${codename} stable" | \
        $SUDO tee /etc/apt/sources.list.d/docker.list >/dev/null

      $SUDO apt-get update -y
      $SUDO apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      $SUDO systemctl enable --now docker || true
      ;;

    dnf)
      $SUDO dnf -y install dnf-plugins-core || true
      local repo_url=""
      case "$ID" in
        fedora) repo_url="https://download.docker.com/linux/fedora/docker-ce.repo" ;;
        rhel|rocky|almalinux|centos|ol) repo_url="https://download.docker.com/linux/centos/docker-ce.repo" ;;
        *) warn "Unknown dnf-based distro '$ID'; trying CentOS repo."; repo_url="https://download.docker.com/linux/centos/docker-ce.repo" ;;
      esac
      $SUDO dnf config-manager --add-repo "$repo_url"
      $SUDO dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      $SUDO systemctl enable --now docker || true
      ;;
  esac

  # Allow current user to run docker without sudo on next login
  if id -nG "$USER" | grep -qw docker; then
    log "User already in 'docker' group."
  else
    $SUDO usermod -aG docker "$USER" || warn "Could not add user to docker group"
    warn "You may need to log out/in (or run 'newgrp docker') for group changes to take effect."
  fi

  docker --version || warn "Docker CLI not in PATH yet."
}

# ──────────────────────────────────────────────────────────────────────────────
#  AWS SSO profile + login (non-interactive config write, interactive login)
# ──────────────────────────────────────────────────────────────────────────────
configure_sso() {
  [[ "${USE_SSO}" == "true" ]] || { warn "Skipping SSO profile setup (USE_SSO=false)"; return 0; }

  log "Configuring AWS CLI SSO profile: $PROFILE"
  mkdir -p "${HOME}/.aws"
  touch "${HOME}/.aws/config"

  # Add sso-session block if missing
  if ! grep -q "^\[sso-session ${SSO_SESSION_NAME}\]" "${HOME}/.aws/config"; then
    cat >> "${HOME}/.aws/config" <<EOF

[sso-session ${SSO_SESSION_NAME}]
sso_start_url = ${SSO_START_URL}
sso_region = ${SSO_REGION}
sso_registration_scopes = sso:account:access
EOF
  fi

  # Add profile block if missing
  if ! grep -q "^\[profile ${PROFILE}\]" "${HOME}/.aws/config"; then
    cat >> "${HOME}/.aws/config" <<EOF

[profile ${PROFILE}]
sso_session = ${SSO_SESSION_NAME}
sso_account_id = ${AWS_ACCOUNT_ID}
sso_role_name = ${AWS_ROLE_NAME}
region = ${REGION}
output = json
EOF
  fi

  aws sso login --sso-session "${SSO_SESSION_NAME}"
  aws sts get-caller-identity --profile "${PROFILE}"
}

# ──────────────────────────────────────────────────────────────────────────────
#  ECR login test (validates AWS CLI + Docker setup)
# ──────────────────────────────────────────────────────────────────────────────
test_ecr() {
  log "Testing ECR registry login for account ${AWS_ACCOUNT_ID} in ${REGION}"
  aws ecr get-login-password --profile "${PROFILE}" --region "${REGION}" | \
    docker login --username AWS --password-stdin \
      "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com" || \
      warn "ECR login failed (ensure your SSO/role has ecr:GetAuthorizationToken)"
}

# ──────────────────────────────────────────────────────────────────────────────
#  Run all steps
# ──────────────────────────────────────────────────────────────────────────────
install_prereqs
install_aws_cli
install_terraform
install_docker
configure_sso
test_ecr

log "Done. Toolchain installed and authenticated."
echo "AWS profile: ${PROFILE}  |  Region: ${REGION}"
echo "Try:  aws --profile ${PROFILE} s3 ls"
echo "Try:  docker run --rm hello-world"
```

---

### How to run

```bash
# 1) Save the script
curl -fsSLo setup_aws_linux.sh https://example.invalid/setup_aws_linux.sh   # or paste it manually
chmod +x setup_aws_linux.sh

# 2) Run with your values (recommended way: pass as env vars)
REGION=eu-central-1 \
AWS_ACCOUNT_ID=123456789012 \
AWS_ROLE_NAME=AdministratorAccess \
SSO_START_URL="https://your-company.awsapps.com/start" \
SSO_REGION=eu-central-1 \
PROFILE=projektbezkodu-dev \
./setup_aws_linux.sh
```

> After it finishes, open a **new shell** (or `newgrp docker`) so your `docker` group membership is active, then try:
>
> ```bash
> aws --profile projektbezkodu-dev sts get-caller-identity
> docker run --rm hello-world
> ```

---

### Why these steps (official references)

* **AWS CLI v2** install via the official Linux zip, and **SSO (IAM Identity Center)** profile/login are per AWS docs. ([AWS Documentation][1])
* **Terraform** install uses HashiCorp’s official **apt/dnf** repositories. ([HashiCorp Developer][2])
* **Docker Engine** install follows Docker’s official **apt/dnf** guides (Ubuntu/Debian/Fedora). ([Docker Documentation][3])
