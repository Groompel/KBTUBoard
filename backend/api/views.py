import json, time, datetime, random
from datetime import timezone
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_jwt import views as jwt_views
from api.models import Post, Code, UserProfile, TeacherInfo
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import get_user_model
from api.serializers import PostSerializer, CodeSerializer, UserProfileSerializer, TeacherSerializer
from django.db import IntegrityError
from django.shortcuts import render
from rest_framework_jwt.utils import jwt_decode_handler
# Create your views here.

class UsersList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def search_view(request, category_id):
    time.sleep(1)
    params = request.GET
    query = params.get('query') or ''
    subcategory = params.get('subcategory') or 1
    subcategory = int(subcategory)
    search_in_desc = params.get('searchInDesc') or 0
    search_in_desc = int(search_in_desc)
    sort_by = params.get('sortBy') or 'title' if category_id == 2 else 'name'
    first_posts = params.get('firstPostsBy') or 'asc'
    first_posts = '-' if first_posts == 'desc' else ''

    # Lost and found
    if category_id == 2:
        sort_by = first_posts + ('title' if sort_by == 'title' else 'creation_date')
        if not search_in_desc:
            posts = Post.objects.filter(
                title__icontains=query,
                subcategory_id=subcategory,
            ).order_by(sort_by)
            ser = PostSerializer(posts, many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else:
            posts = Post.objects.filter(
                Q(title__icontains=query) | Q(description__icontains=query),
                subcategory_id=subcategory,
            ).order_by(sort_by)
            ser = PostSerializer(posts, many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
    elif category_id == 3:
        sort_by = first_posts + ('user__name' if sort_by == 'name' else 'rating')

        if not search_in_desc:
            teachers = TeacherInfo.objects.filter(
                user__name__icontains=query,
                is_teaching=True,
            ).order_by(sort_by)
            ser = TeacherSerializer(teachers, many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
        else:
            teachers = TeacherInfo.objects.filter(
                Q(user__name__icontains=query) | Q(subject__icontains=query),
                is_teaching=True,
            ).order_by(sort_by)
            ser = TeacherSerializer(teachers, many=True)
            return Response(ser.data, status=status.HTTP_200_OK)
    else:
        return Response([], status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
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

class UserDetails(APIView):

    permission_classes = ([IsAuthenticated,])

    def get_user(self, username):
        try:
            return UserProfile.objects.get(user__username=username)
        except UserProfile.DoesNotExist as e:
            return e
    def get(self, request, username):
        token = request.headers['Authorization'].split(' ')[1]
        token_payload = jwt_decode_handler(token)
        user_inst = None

        if username == token_payload['username']:
            user_inst = self.get_user(username)
        else:
            return Response({'error': 'Forbidden'}, status=403)

        if type(user_inst)  == UserProfile:
            ser = UserProfileSerializer(user_inst)
            return Response(ser.data, status=200)

        elif type(user_inst) == UserProfile.DoesNotExist:
            return Response({'error': str(user_inst)}, status=400)
        else:
            return Response({'error': str(user_inst)}, status=500)
    
    def put(self, request, username):
        token = request.headers['Authorization'].split(' ')[1]
        token_payload = jwt_decode_handler(token)
        user_inst = None
        
        if username == token_payload['username']:
            user_inst = self.get_user(username)
        else:
            return Response({'error': 'Forbidden'}, status=403)
        
        data = request.data

        if type(user_inst) == UserProfile:
            ser = UserProfileSerializer(instance=user_inst, data=data)
            if ser.is_valid():
                ser.save()
                return Response(ser.data, status=200)
            return Response({'errors': ser.errors()}, status=400)
        elif type(user_inst) == UserProfile.DoesNotExist:
            return Response({'error': str(user_inst)}, status=400)
        else:
            return Response({'error': str(user_inst)}, status=500)


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
        except Exception as e:
            Response({
                'error': str(e)
            }, status=400)

    else: 
        return Response('Code not validated!', status=403)

@permission_classes([AllowAny])
class UserLoginViewJWT(jwt_views.ObtainJSONWebToken):
    # user_serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
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
        for i in range(6):
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

    