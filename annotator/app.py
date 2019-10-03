#!/usr/bin/env python
import os

from flask import Flask, render_template, request, jsonify, flash, url_for
import threading
import queue
import webbrowser
import json
import docx
from keras.preprocessing.text import text_to_word_sequence
import re
import socket

from werkzeug.utils import redirect, secure_filename

UPLOAD_FOLDER = './documents'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

############## SUPPORT FUNCTIONS ##############

def open_browser():
	webbrowser.open('http://0.0.0.0:80')

def getText(filename):
    doc = docx.Document(filename)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return '\n'.join(fullText)

def process_model(text):
	answer = text_to_word_sequence(text, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=False, split=' ')
	
	badwords=[]
	path = './words/words.txt'

	with open(path, 'rb') as f:
		badwords=str(f.read()).replace("b'", '').replace("'", '')
		vocab=badwords.split('\\n')

	print(badwords)
	print(vocab)

	for index in range(len(answer)):
		if answer[index].lower() in vocab:
			answer[index]="<span class='badwords'>"+answer[index]+"</span>"
		if re.search(r'[A-Z][A-Z]+', answer[index]):
			answer[index]="<span class='capitalised'>"+answer[index]+"</span>"
		if re.search(r'[0-9]+', answer[index]):
			answer[index]="<span class='numeric'>"+answer[index]+"</span>"
		result=" ".join(answer)
	return result



########### /SUPPORT FUNCTIONS ###############

# from flask.logging import default_handler
# import logging
# root = logging.getLogger()
# root.addHandler(default_handler)

#app = Flask(__name__)


@app.route('/')
def index():
	return render_template('form.html')

@app.route('/register', methods=['POST'])
def register_path():
	try:
		filename = request.form['register_input']
		filename = "./documents/"+filename
		#print("filepath: ", input_string)
		text = getText(filename)
		text = process_model(text)
		#print(text)
		return jsonify({'answer' : text})
	except Exception as e: 
		print("error message: ", str(e))
		return jsonify({'error' : 'Missing data!!!'})

@app.route('/download', methods=['POST'])
def download_data():
	try:
		if request.method == 'POST':
			file = request.files['file']
			#print(file)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
			return redirect(url_for('.index', filename=file.filename))
			# return render_template('form.html', filename=)

	except Exception as e:
		print("error message: ", str(e))
		# return jsonify({'answer': "NAY"})
		return jsonify({'error': 'Missing data!!!'})

@app.route('/export', methods=['POST'])
def export_data():
	try:
		data = request.form['export_input']
		data = json.loads(data)
		document_name1 = "./data/"+data[0].replace('.','')
		document_name2 = "./report/"+data[0].replace('.','')
		#print(document_name)
		report=data[1]
		reportz=''
		for sample in report:
			reportz=reportz+"SENTENCE:\n"+sample['sent']+" \n*********************\n"+"DESCRIPTION: "+sample['class_desc']+"\n\n\n\n"

		with open(document_name1+".json", 'w') as f:
			json.dump(data[1], f)
		with open(document_name2+".txt", 'w') as f:
			f.write(reportz)
		return jsonify({'answer' : 'export successful'})
	except Exception as e:
		print("error message: ", str(e))
		return jsonify({'error' : e })



if __name__ == '__main__':
	#threading.Thread(target=open_browser).start()
	app.run(host='localhost', debug=True)
