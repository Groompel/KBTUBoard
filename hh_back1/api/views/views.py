import json, time, datetime, random
from datetime import timezone
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Post, Code
from api.serializers import PostSerializer, CodeSerializer
from rest_framework.decorators import api_view, permission_classes



class PostsList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)


class PostDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)


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

    