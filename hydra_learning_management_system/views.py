import datetime
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.core import serializers
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import *


# from google.oauth2.credentials import Credentials

# Create your views here.

# Note: The decorator must be included because we don't
# have CSRF token in the header

@csrf_exempt
def register(request):
    if request.method == "POST":
        now = datetime.date.today()
        now = str(now)
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        email = data['email']
        role = data['role']
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
        if not re.match(pattern, password):
            return JsonResponse({'status': 403,
                                 'msg': 'Error: The password must meet the following criteria: At least 8-digit long. At Least 1 Uppercase. At Least 1 Lowercase. At Least 1 number.'})
        users = Users.objects.all()
        users = serializers.serialize("python", users)
        names = []
        emails = []
        for i in users:
            names.append(i["fields"]["username"])
            emails.append(i["fields"]["email"])
        if username in names:
            return JsonResponse({'status': 403, 'msg': 'Error: This username has already existed'})
        if email in emails:
            return JsonResponse({'status': 403, 'msg': 'Error: This email has already existed'})
        user = Users.objects.create(username=username, password=password, email=email, role=role, birthday=now)
        return JsonResponse({'status': 200, 'msg': 'Register Success'})


@csrf_exempt
def log_in(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        uid = Users.objects.get(username=username).uid
        rightpwd = Users.objects.get(username=username).password
        role = Users.objects.get(username=username).role

        if password == rightpwd:
            return JsonResponse({'status': 200, 'msg': 'Log in Success', 'uid': uid, "role": role})
        else:
            return JsonResponse({'status': 403, 'msg': 'Error: The entered user name and password do not match'})


@csrf_exempt
def logout(request):
    if request.method == "GET":
        return JsonResponse({'status': 200})


@csrf_exempt
def showprofile(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        user_info = Users.objects.get(uid=uid)
        username = user_info.username
        firstname = user_info.firstname
        lastname = user_info.lastname
        gender = user_info.gender
        birthday = user_info.birthday
        email = user_info.email
        zoomlink = user_info.zoomlink
        preferedlanguage = user_info.preferredlanguage
        return JsonResponse({
            "Firstname": firstname,
            "Lastname": lastname,
            "gender": gender,
            "birthday": birthday,
            "email": email,
            "language": preferedlanguage,
            "zoomlink": zoomlink
        })


@csrf_exempt
def editprofile(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        uid = data["uid"]
        firstname = data["firstname"]
        lastname = data["lastname"]
        gender = data["gender"]
        birthday = data["birthday"]
        email = data["email"]
        language = data["preferedlanguage"]
        zoomlink = data["zoomlink"]
        user = Users.objects.get(uid=uid)
        user.firstname = firstname
        user.lastname = lastname
        user.gender = gender
        user.birthday = birthday
        user.email = email
        user.preferredlanguage = language
        user.zoomlink = zoomlink
        user.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def forget_pwd_send_link_1(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email_to = data["email"]
        users = Users.objects.all()
        users = serializers.serialize("python", users)
        emails = []
        for i in users:
            emails.append(i["fields"]["email"])
        if email_to not in emails:
            return JsonResponse({'status': 403, 'msg': 'Error: This email never exists.'})

        smtp_port = 587
        smtp_server = 'smtp.gmail.com'
        email_from = 'randomzsh@gmail.com'
        pwd = 'ehomuqhuogjozndr'

        body = "This is the reset pwd link: http://localhost:3000/resetpassword/2"
        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["Subject"] = "reset pwd"
        msg.attach(MIMEText(body, "plain"))
        TIE_server = smtplib.SMTP(smtp_server, smtp_port)
        TIE_server.starttls()
        TIE_server.login(email_from, pwd)
        msg["To"] = email_to
        text = msg.as_string()
        TIE_server.sendmail(email_from, email_to, text)
        TIE_server.quit()
        return JsonResponse({"status": 200, "msg": "send success"})


@csrf_exempt
def forget_pwd_send_link_2(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        pwd = data["password"]
        users = Users.objects.all()
        users = serializers.serialize("python", users)
        names = []
        for i in users:
            names.append(i["fields"]["username"])
        if username not in names:
            return JsonResponse({'status': 403, 'msg': 'Error: This username never exists.'})
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
        if not re.match(pattern, pwd):
            return JsonResponse({'status': 403,
                                 'msg': 'Error: The password must meet the following criteria: At least 8-digit long. At Least 1 Uppercase. At Least 1 Lowercase. At Least 1 number.'})
        user = Users.objects.get(username=username)
        user.password = pwd
        user.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def createcourses(request):
    if request.method == "POST":
        course_info = json.loads(request.body)
        uid = course_info["uid"]
        coursename = course_info['coursename']
        creator = Users.objects.get(uid=uid)
        coursedecription = course_info['coursedescription']
        gradedistribution = course_info['gradedistribution']
        courses = Courses.objects.all()
        courses = serializers.serialize("python", courses)
        names = []
        for i in courses:
            names.append(i["fields"]["coursename"])
        if coursename in names:
            return JsonResponse({"status": 403, "error": "Error: This course already exists!"})
        course = Courses.objects.create(coursename=coursename, creatorid=creator,
                                        coursedescription=coursedecription, gradedistribution=gradedistribution)
        enrollment = Enrollments.objects.create(cid=course, uid=creator)
        if course:
            return JsonResponse({'status': 200})
        else:
            return JsonResponse({'status': 403})


@csrf_exempt
def enrollcourses(request):
    # We assume the max enrollment of a course is 45.
    MAX_SEAT = 45
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data['uid']
        coursename = data['coursename']
        # print(data)
        course = Courses.objects.get(coursename=coursename)
        cid = course.cid
        enrollers = Enrollments.objects.filter(cid=course)
        enrollers = serializers.serialize("python", enrollers)
        uidss = []
        for i in enrollers:
            tmp = i["fields"]["uid"]
            uidss.append(tmp)
        uid = int(uid)

        if uid in uidss:
            return JsonResponse({"status": 500, "error": "You have already enrolled this course!"})
            # print(uid)
        seat = len(enrollers)
        # enrolllist = course.enrolllist
        # enrolllist = json.loads(enrolllist)["enrolllist"]
        # print(enrolllist)
        available = MAX_SEAT - seat
        if available > 0:
            enroll_flag = Enrollments.objects.filter(cid=1)
            enroll_flag = serializers.serialize("python", enroll_flag)
            # print(enroll_flag)
            course = Courses.objects.get(cid=cid)
            user = Users.objects.get(uid=uid)
            enrollment = Enrollments.objects.create(cid=course, uid=user)
            assessment = Assessments.objects.create(uid=user, cid=course)
            return JsonResponse({'status': 200})
        else:
            return JsonResponse({"status": 500, "error": f"The enrollment failed"})
        # return JsonResponse({'status':200})


@csrf_exempt
def deletecourses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        cid = data['cid']
        course = Courses.objects.get(cid=cid)
        course.delete()
        return JsonResponse({"status": 200})


@csrf_exempt
def quizlist(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data["cid"]
        course = Courses.objects.get(cid=cid)
        quiz = Quizzes.objects.filter(cid=course)
        quiz = serializers.serialize("python", quiz)
        quizzes = []
        for i in quiz:
            tmp = {}
            tmp["qid"] = i['pk']
            quizzes.append(tmp)
        return JsonResponse({"quiz": quizzes})


@csrf_exempt
def createdcourses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        creator = Users.objects.get(uid=uid)
        courses = Courses.objects.filter(creatorid=creator)
        courses = serializers.serialize("python", courses)
        course = []
        for i in courses:
            tmp = {}
            cid = i["pk"]
            tmp["coursename"] = i["fields"]["coursename"]
            tmp["coursedescription"] = i["fields"]["coursedescription"]
            tmp["coursedescription"] = i["fields"]["coursedescription"]
            tmp["cid"] = cid
            course.append(tmp)
        return JsonResponse({"courses": course})


@csrf_exempt
def showcourses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data['uid']
        courses = Courses.objects.all()
        courses = serializers.serialize("python", courses)
        course = []
        for i in courses:
            creatorid = i["fields"]["creatorid"]
            creatorname = Users.objects.get(uid=creatorid).username
            i["fields"]["creatorname"] = creatorname
            i = i["fields"]
            course.append(i)
        # print(course)
        return JsonResponse({"status": 200, "courses": course})


@csrf_exempt
def dropcourses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # print(data)
        cid = data['cid']
        uid = data['uid']
        course = Courses.objects.get(cid=cid)
        user = Users.objects.get(uid=uid)
        # course.delete()
        enrollment = Enrollments.objects.get(cid=course, uid=user)
        enrollment.delete()
        return JsonResponse({'status': 200})


@csrf_exempt
def enrolledcourses(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # print(data,"111")
        uid = data['uid']
        cid = Enrollments.objects.filter(uid=uid)
        cid = serializers.serialize("python", cid)
        # print(cid)
        cids = []
        for i in cid:
            tmp = i["fields"]["cid"]
            cids.append(tmp)
        # print(cids)
        courses = []
        for i in cids:
            course = Courses.objects.get(cid=i)
            course = serializers.serialize('python', [course])
            tmp = course[0]["fields"]
            tmp["cid"] = course[0]['pk']
            courses.append(tmp)
        # print(courses)
        return JsonResponse({"courses": courses})


@csrf_exempt
def createquiz(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data['cid']
        ddl = data["ddl"]
        q1 = data["q1"]
        q2 = data["q2"]
        q3 = data["q3"]
        ans = data["ans"]
        course = Courses.objects.get(cid=cid)
        quiz = Quizzes.objects.create(cid=course, ddl=ddl, q1=q1, q2=q2, q3=q3, ans=ans)
        if quiz is not None:
            return JsonResponse({'status': 200})
        else:
            return JsonResponse({'status': 403})
        # return JsonResponse({"status": 200})


@csrf_exempt
def attendquiz(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data['uid']
        cid = data["cid"]
        qid = data['qid']
        ans = data["ans"]
        rightans = Quizzes.objects.get(qid=qid).ans
        score = 0
        for i in range(len(ans)):
            if ans[i] == rightans[i]:
                score += 1
        # 存分
        print(score)
        course = Courses.objects.get(cid=cid)
        user = Users.objects.get(uid=uid)
        assessment = Assessments.objects.get(cid=course, uid=user)
        grade = assessment.grade
        grade = json.loads(grade)
        grade["quiz"].append(score)
        grade = json.dumps(grade)
        assessment.grade = grade
        assessment.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def reviewquiz(request):
    if request.method == "POST":
        data = json.loads(request.body)
        qid = data["qid"]
        quiz = Quizzes.objects.get(qid=qid)
        # quiz = json.dumps(quiz)
        quiz = serializers.serialize("python", [quiz])[0]["fields"]
        # print(quiz)
        return JsonResponse({"quiz": quiz})


@csrf_exempt
def createass(request):
    # git status
    if request.method == "POST":
        data = json.loads(request.body)
        title = data["title"]
        cid = data["cid"]
        course = Courses.objects.get(cid=cid)
        url = data["url"]
        assdescription = data["assdescription"]
        ass = Assignments.objects.create(cid=course, url=url, title=title, assignmentdescription=assdescription)
        if ass is not None:
            return JsonResponse({'status': 200})
        else:
            return JsonResponse({'status': 403})


@csrf_exempt
def showass(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data["cid"]
        asses = Assignments.objects.filter(cid=cid)
        asses = serializers.serialize("python", asses)
        ass = []
        for i in asses:
            tmp = {}
            tmp["assignemntdescription"] = i["fields"]["assignmentdescription"]
            tmp["cid"] = i["pk"]
            tmp["title"] = i["fields"]["title"]
            tmp["url"] = i["fields"]["url"]
            tmp['aid'] = i['pk']
            ass.append(tmp)
        return JsonResponse({"asses": ass})


@csrf_exempt
def submitass(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        cid = data["cid"]
        aid = data['aid']
        ass = data["ass"]  ##link
        user = Users.objects.get(uid=uid)
        course = Courses.objects.get(cid=cid)
        assessment = Assessments.objects.get(uid=user, cid=course)
        worklink = assessment.worklink
        worklink = json.loads(worklink)
        worklink[aid] = ass
        worklink = json.dumps(worklink)
        assessment.worklink = worklink
        assessment.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def markass(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        cid = data["cid"]
        aid = data["aid"]
        mark = data["mark"]
        mark = int(mark)
        user = Users.objects.get(uid=uid)
        course = Courses.objects.get(cid=cid)
        assessment = Assessments.objects.get(uid=user, cid=course)
        grade = assessment.grade
        grade = json.loads(grade)
        grade['ass'].append(mark)
        grade = json.dumps(grade)
        assessment.grade = grade
        assessment.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def grade(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        cid = data["cid"]
        user = Users.objects.get(uid=uid)
        course = Courses.objects.get(cid=cid)
        grade = Assessments.objects.get(uid=user, cid=course).grade
        grade = json.loads(grade)
        print(grade)
    return JsonResponse({"grade": grade})


@csrf_exempt
def postes(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pid = data['pid']
        post = Posts.objects.get(pid=pid)
        post = serializers.serialize("python", [post])
        post = post[0]
        uid = post["fields"]["creatorid"]
        creatorname = Users.objects.get(uid=uid).username
        post["fields"]["creatorname"] = creatorname
        post["fields"]["reply"] = json.loads(post["fields"]["reply"])
        post["fields"]["likes"] = json.loads(post["fields"]["likes"])
        post["fields"]["flagged"] = json.loads(post["fields"]["flagged"])["flagged"]
        # post["fields"]["privacy"] = json.loads(post["fields"]["privacy"])["privacy"]
        post = post["fields"]
        # print(post)
        return JsonResponse(post)


@csrf_exempt
def forum(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data['cid']
        post = Posts.objects.filter(cid=cid)
        post_info = serializers.serialize('python', post)
        p = []
        for i in post_info:
            i["fields"]["pid"] = i["pk"]
            i = i["fields"]
            i["flagged"] = json.loads(i["flagged"])
            i["likes"] = json.loads(i["likes"])
            i["reply"] = json.loads(i["reply"])
            uid = i["creatorid"]
            creatorname = Users.objects.get(uid=uid).username
            i["creatorname"] = creatorname
            p.append(i)
        return JsonResponse({"posts": p})


@csrf_exempt
def createposts(request):
    now = datetime.date.today()
    if request.method == "POST":
        data = json.loads(request.body)
        creatorid = data['creatorid']
        cid = data['cid']
        cid = Courses.objects.get(cid=cid)
        creatorid = Users.objects.get(uid=creatorid)
        title = data['title']
        content = data['content']
        createtime = now
        keyword = data['keyword']
        multimedia = data['multimedia']
        reply = json.dumps({"reply": []})
        likes = json.dumps({"likes": []})
        editted = False
        flagged = json.dumps({"flagged": []})
        privacy = False
        post = Posts.objects.create(creatorid=creatorid, cid=cid, createtime=createtime, keyword=keyword, title=title
                                    , content=content, multimedia=multimedia, reply=reply, likes=likes,
                                    editted=editted, flagged=flagged, privacy=privacy)
        if post is not None:
            return JsonResponse({'pid': post.pid, 'status': 200})
        else:
            return JsonResponse({'status': 403})


@csrf_exempt
def editposts(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data['uid']
        post = Posts.objects.get(pid=pid)
        ownerid = post.creatorid.uid
        uid = int(uid)
        if uid == ownerid:
            post.title = data["title"]
            post.content = data["content"]
            post.keyword = data["keyword"]
            post.multimedia = data["multimedia"]
            post.editted = True
            post.save()
            return JsonResponse({"status": 200, "msg": "edit success"})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def flagposts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data["uid"]
        post = Posts.objects.get(pid=pid)
        flagged = post.flagged
        flagged = json.loads(flagged)
        if uid in flagged["flagged"]:
            flagged["flagged"].remove(uid)
            flagged = json.dumps(flagged)
            post.flagged = flagged
            post.save()
            return JsonResponse({"status": 200, "msg": "flag removes"})
        flagged["flagged"].append(uid)
        flagged = json.dumps(flagged)
        post.flagged = flagged
        post.save()
        return JsonResponse({"status": 200, "msg": "flag success"})


@csrf_exempt
def replyposts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        pid = data['pid']
        content = data['content']
        user = Users.objects.get(uid=uid)
        post = Posts.objects.get(pid=pid)
        reply = Replies.objects.create(pid=post, creator_id=user, content=content)
        username = user.username
        replylist = post.reply
        replylist = json.loads(replylist)
        replylist["reply"].append({f'{username}': content})
        replylist = json.dumps(replylist)
        post.reply = replylist
        post.save()
        if reply is not None:
            return JsonResponse({"status": 200})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def likeposts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data["uid"]
        post = Posts.objects.get(pid=pid)
        likes = post.likes
        likes = json.loads(likes)
        if uid in likes['likes']:
            likes["likes"].remove(uid)
            likes = json.dumps(likes)
            post.likes = likes
            post.save()
            return JsonResponse({"status": 200, "msg": "like remove"})
        else:
            likes['likes'].append(uid)
            likes = json.dumps(likes)
            post.likes = likes
            post.save()
            return JsonResponse({"status": 200, "msg": "like success"})


@csrf_exempt
def setprivate(request):
    if request.method == "POST":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data["uid"]
        post = Posts.objects.get(pid=pid)
        ownerid = post.creatorid.uid
        lectorid = post.cid.creatorid.uid
        uid = int(uid)
        # print(uid, ownerid, lectorid)
        # print(type(uid), type(ownerid), type(lectorid))
        if uid == ownerid or uid == lectorid:
            post.privacy = not post.privacy
            post.save()
            if post.privacy == True:
                return JsonResponse({"status": 200, "msg": "privacy set"})
            else:
                return JsonResponse({"status": 200, "msg": "privacy unset"})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def deleteposts(request):
    if request.method == "DELETE":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data["uid"]
        post = Posts.objects.get(pid=pid)
        if post is not None:
            post.delete()
            return JsonResponse({"status": 200})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def deletereplys(request):
    if request.method == "DELETE":
        data = json.loads(request.body)
        pid = data["pid"]
        uid = data["uid"]
        reply = Replies.objects.get(uid=uid)
        replylist = Posts.objects.get(pid=pid).replyments
        replylist = []
        if reply is not None:
            reply.delete()
            return JsonResponse({"status": 200})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def uploadmaterial(request):
    if request.method == "POST":
        data = json.loads(request.body)
        type = data["type"]
        cid = data["cid"]
        course = Courses.objects.get(cid=cid)
        filepath = data["filepath"]
        materials = Materials.objects.create(type=type, cid=course, filepath=filepath)
        if materials is not None:
            return JsonResponse({"status": 200})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def downloadmaterial(request):
    if request.method == "POST":
        data = json.loads(request.body)
        mid = data["mid"]
        filepath = Materials.objects.get(mid=mid).fileacopath
        if filepath is not None:
            return JsonResponse({"filepath": filepath})
        else:
            return JsonResponse({"status": 403})


@csrf_exempt
def showmaterial(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data["cid"]
        materials = Materials.objects.filter(cid=cid)
        m = serializers.serialize("python", materials)
        res = []
        for i in m:
            i["fields"]['mid'] = i['pk']
            i = i["fields"]
            res.append(i)
        return JsonResponse({"material": res})


@csrf_exempt
def translate(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        user = Users.objects.get(uid=uid)
        language = user.preferredlanguage
        return JsonResponse({"language": language})


@csrf_exempt
def announcement(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data['cid']
        # title = data["title"]
        content = data["content"]
        course = Courses.objects.get(cid=cid)
        coursename = course.coursename
        enrollment = Enrollments.objects.filter(cid=course)
        enrollment = serializers.serialize("python", enrollment)
        uids = []
        for i in enrollment:
            tmp = i["fields"]["uid"]
            uids.append(tmp)
        sendemail(coursename, uids, content)
        return JsonResponse({"status": 200})


def sendemail(coursename, uids, content):
    smtp_port = 587
    smtp_server = 'smtp.gmail.com'
    email_from = 'randomzsh@gmail.com'
    pwd = 'ehomuqhuogjozndr'

    body = content
    msg = MIMEMultipart()
    msg["From"] = email_from
    msg["Subject"] = f"Course {coursename} Email"
    msg.attach(MIMEText(body, "plain"))
    TIE_server = smtplib.SMTP(smtp_server, smtp_port)
    TIE_server.starttls()
    TIE_server.login(email_from, pwd)
    for i in uids:
        email_to = Users.objects.get(uid=i).email
        msg["To"] = email_to
        text = msg.as_string()
        TIE_server.sendmail(email_from, email_to, text)
    TIE_server.quit()


@csrf_exempt
def materialannouncement(request):
    if request.method == "POST":
        # data =
        return JsonResponse({"status": 200})


@csrf_exempt
def onlinecourseannouncement(request):
    if request.method == "POST":
        return JsonResponse({"status": 200})


def simplesend(content, email_from, email_to, title):
    smtp_port = 587
    smtp_server = 'smtp.gmail.com'
    email_from = 'randomzsh@gmail.com'
    pwd = 'ehomuqhuogjozndr'

    body = content
    msg = MIMEMultipart()
    msg["From"] = email_from
    msg["Subject"] = title
    msg.attach(MIMEText(body, "plain"))
    TIE_server = smtplib.SMTP(smtp_server, smtp_port)
    TIE_server.starttls()
    TIE_server.login(email_from, pwd)
    msg["To"] = email_to
    text = msg.as_string()
    TIE_server.sendmail(email_from, email_to, text)
    TIE_server.quit()


@csrf_exempt
def uploadavatar(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        ava = data["avatar"]
        user = Users.objects.get(uid=uid)
        user.avatar = ava
        user.save()
        return JsonResponse({"status": 200})


@csrf_exempt
def downloadavatar(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        user = Users.objects.get(uid=uid)
        ava = user.avatar
        return JsonResponse({"ava": ava})


@csrf_exempt
def startlive(request):
    if request.method == "POST":
        data = json.loads(request.body)
        uid = data["uid"]
        user = Users.objects.get(uid=uid)
        zoomlink = user.zoomlink
        return JsonResponse({"zoomlink": zoomlink})


@csrf_exempt
def showlive(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cid = data["cid"]
        course = Courses.objects.get(cid=cid)
        zoomlink = course.creatorid.zoomlink
        return JsonResponse({"zoomlink": zoomlink})


@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # print(data)
        cid = data['cid']
        msg = data["message"]
        course = Courses.objects.get(cid=cid)
        material = Materials.objects.all()
        material = serializers.serialize("python", material)[0]
        post = Posts.objects.filter(cid=course)
        # post = serializers.serialize("python", post)[0]
        #
        # print(re.search(r"lecturer",msg))
        if re.search(r"lecturer", msg):
            return JsonResponse({"message": course.creatorid.username})
        if re.search(r"material", msg):
            return JsonResponse({"message": material["fields"]['filepath']})
        # if re.search(r"forum", msg):
        #     return JsonResponse({"post": post["fields"]})
        else:
            return JsonResponse({"message": "Sorry, I cannot understand. Could you ask me again?"})
