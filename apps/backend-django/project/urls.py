from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

def healthz(_): return JsonResponse({"ok": True})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", healthz),
]
