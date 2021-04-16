from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api_ocr import ocr
import json


@api_view(['GET','POST'])
def hello_from_new_way(request):
    
    if request.method == 'POST':
        return Response(str(ocr.getbase64picture(json.loads(request.body)['data'])))

    return Response({"message": "Got some data!", "data": request.data})