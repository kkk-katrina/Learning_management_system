"""comp9900 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from hydra_learning_management_system import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.log_in),
    path("register/", views.register),
    path('forgetpwd1/',views.forget_pwd_send_link_1),
    path('forgetpwd2/',views.forget_pwd_send_link_2),

    path("createcourses/", views.createcourses),
    path("enrollcourses/", views.enrollcourses),

    path("courses/", views.showcourses),
    path("createdcourses/", views.createdcourses),
    path("dropcourses/", views.dropcourses),
    path("enrolledcourses/", views.enrolledcourses),
    path("deletecourses/", views.deletecourses),

    path("createquiz/", views.createquiz),
    path("attendquiz/", views.attendquiz),
    path("reviewquiz/", views.reviewquiz),
    #path("showquiz/",views.showquiz),
    path("quizlist/",views.quizlist),

    path("createass/", views.createass),
    path("submitass/", views.submitass),
    path("markass/", views.markass),
    path("showass/", views.showass),

    path("grade/", views.grade),

    path("forum/", views.forum),
    path("posts/", views.postes),
    path("createposts/", views.createposts),
    path("replyposts/", views.replyposts),
    path("flagposts/", views.flagposts),
    path("likeposts/", views.likeposts),
    path("setprivate/", views.setprivate),
    path("deleteposts/", views.deleteposts),
    path("deletereplys/", views.deletereplys),
    path("editposts/", views.editposts),

    path("uploadmaterial/", views.uploadmaterial),
    path("downloadmaterial/", views.downloadmaterial),
    path("showmaterial/", views.showmaterial),

    path("showprofile/",views.showprofile),
    path("editprofile/",views.editprofile),

    path("translate/",views.translate),

    path("announcement/",views.announcement),
    path("materialannouncement/", views.materialannouncement),
    path("onlinecourseannouncement/",views.onlinecourseannouncement),

    path("uploadavatar/",views.uploadavatar),
    path("downloadavatar/",views.downloadavatar),

    path("startlivestream/", views.startlive),
    path("showlive/",views.showlive),
    path("chatbot/",views.chatbot)

    # announcementpath(),#create live, show live, sholive
    # path(),
    # path(),
]
