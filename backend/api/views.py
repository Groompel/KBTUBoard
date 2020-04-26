import json, time, datetime, random
from datetime import timezone
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_jwt import views as jwt_views
from api.models import Post, Code, UserProfile
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from api.serializers import PostSerializer, CodeSerializer, UserProfileSerializer
from django.db import IntegrityError


from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CodeSerializer
from .models import Code
import time, random, datetime
from datetime import timezone
# Create your views here.

class UsersList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


#  permission_classes = (IsAuthenticated,)


class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


# permission_classes = (IsAuthenticated,)


@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
def teachers_list(request):
    if request.method == 'GET':
        teachers = TeacherInfo.objects.filter(is_teaching=True)
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticated])
def teacher_detail(request, teacher_id):
    try:
        teacher = TeacherInfo.objects.get(id=teacher_id)
    except TeacherInfo.DoesNotExist as e:
        return Response({'error': str(e)})

    # Get one objects
    if request.method == 'GET':
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

        # Update selected objects
    elif request.method == 'PUT':
        serializer = TeacherSerializer(instance=teacher, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response({'error': serializer.errors})

        # Delete selected object
    elif request.method == 'DELETE':
        teacher.delete()
        return Response({'deleted': True})




class PostsList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    user = data['user']
    code_ins = Code.objects.get(code=user['code'])

    if code_ins.is_valid:
        try: 
            UserProfile.objects.create(
                user = User.objects.create_user(user['username'], 'None', user['password']),
                name = user['name'],
                telegram_chat_id = code_ins.chat_id,
                telegram_username = code_ins.telegram_username
            )
            return Response('Success', status=201)
        except IntegrityError as e:
            Response({
                'error': str(e)
            }, status=400)

    return Response('Code not validated!', status=403)

@permission_classes([AllowAny])
class UserLoginViewJWT(jwt_views.ObtainJSONWebToken):
    # user_serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response =  super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            try:
                user = User.objects.get(username=request.data['username'])
                response.data.update({'username': user.username})
            except User.DoesNotExist as e:
                return Response({'error': str(e)}, status=400)
        return response
    

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def telegramCode(request):
    if (request.method == 'GET'):
        time.sleep(2)
        expiration_minutes = 10
        expire_date = datetime.datetime.now() + datetime.timedelta(minutes=expiration_minutes)
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        code = ''
        for i in range (6):
            code += random.choice(characters)
        
        data = {
            'code': code,
            'chat_id': '-',
            'telegram_username': '-'
        }

        ser = CodeSerializer(data=data)

        if ser.is_valid():
            ser.save()
            return Response({
                'code': code,
                'expirationDate': int(time.mktime(expire_date.timetuple())) * 1000
            }, status=200)
        return Response({
            'errors': ser.errors
        }, status=400)

    elif (request.method == 'POST'):
        code = request.data.get('code')
        chat_id = request.data.get('chat_id')
        telegram_username = request.data.get('telegram_username')
        print(code, chat_id, telegram_username)

        try: 
            code_instance = Code.objects.get(code = code) 
        except Code.DoesNotExist as e:
            return Response('Код не найден.', status=404)

        if code_instance.is_valid == True:
            return Response('Code already validated', status=201)

        timeDiff = datetime.datetime.now(timezone.utc) - code_instance.created_at
        if timeDiff.days * 24 * 60 < 10:
            ser = CodeSerializer(instance=code_instance, data=request.data)
            if ser.is_valid():
                ser.save()
                return Response('Success', status=200)
            return Response(ser.errors(), status=500)
        return Response('Code expired', status = 400)


@api_view(['POST'])
@permission_classes([AllowAny])
def checkTelegramCode(request):
    time.sleep(3)
    code = request.data.get('code')
    print(code)
    try: 
        code_instance = Code.objects.get(code = code) 
    except Code.DoesNotExist as e:
        return Response('Код не найден.', status=404)


    return Response({
        'valid': code_instance.is_valid,
        'message': 'Код не был получен ботом.' if not code_instance.is_valid else 'Успешно! Ваш аккаунт привязан к Telegram!'
    }, status=200)

    