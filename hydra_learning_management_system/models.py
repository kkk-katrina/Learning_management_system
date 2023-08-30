import json

from django.db import models


# Create your models here.
class Users(models.Model):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    role = models.CharField(max_length=10)
    firstname = models.TextField(default='')
    lastname = models.TextField(default='')
    gender = models.TextField(default='')
    birthday = models.TextField(default='')
    preferredlanguage = models.TextField(default='')
    avatar = models.TextField(default='')
    zoomlink = models.TextField(default='')


class Courses(models.Model):
    cid = models.AutoField(primary_key=True)
    coursename = models.CharField(max_length=60)
    creatorid = models.ForeignKey(Users, on_delete=models.CASCADE)
    coursedescription = models.TextField()
    gradedistribution = models.TextField()


class Enrollments(models.Model):
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    uid = models.ForeignKey(Users, on_delete=models.CASCADE)


class Assessments(models.Model):
    ####################################################################
    ## It should be uid - json(contains quiz grade infomation) table. ##
    ###################################################################
    uid = models.ForeignKey(Users, on_delete=models.CASCADE)
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    worklink = models.TextField(default="{}")
    grade = models.TextField(default=json.dumps({"quiz": [], "ass": [], "final exam": 0}))


class Quizzes(models.Model):
    qid = models.AutoField(primary_key=True)
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE, default='')
    ddl = models.TextField(default='')
    q1 = models.JSONField(default={})
    q2 = models.JSONField(default={})
    q3 = models.JSONField(default={})
    ans = models.TextField()


class Assignments(models.Model):
    aid = models.AutoField(primary_key=True)
    title = models.TextField(default='')
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    assignmentdescription = models.TextField(default='')
    url = models.TextField()


class Materials(models.Model):
    mid = models.AutoField(primary_key=True)
    type = models.TextField()
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    filepath = models.TextField()


class Posts(models.Model):
    pid = models.AutoField(primary_key=True)
    creatorid = models.ForeignKey(Users, on_delete=models.CASCADE)
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    createtime = models.DateTimeField()
    keyword = models.TextField()
    title = models.TextField()
    content = models.TextField()
    multimedia = models.TextField(default='')
    reply = models.TextField()
    likes = models.TextField()
    editted = models.BooleanField()
    flagged = models.TextField()
    privacy = models.BooleanField()


class Replies(models.Model):
    pid = models.ForeignKey(Posts, on_delete=models.CASCADE)
    creator_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    content = models.TextField()


class LiveStream(models.Model):
    lid = models.AutoField(primary_key=True)
    creatorid = models.ForeignKey(Users, on_delete=models.CASCADE)
    cid = models.ForeignKey(Courses, on_delete=models.CASCADE)
    url = models.TextField()
    attendance = models.TextField()
    createtime = models.TextField(default='')