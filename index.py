#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, redirect, render_template, url_for, make_response, jsonify
# import uuid
import flask.ext.login as flask_login
# import flask_login

import const

app = Flask(__name__)
# cookie を暗号化する秘密鍵 (本来はランダムに作る)
app.config['SECRET_KEY'] = 'The secret key which ciphers the cookie'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
users = {'foo@bar.tld': {'pw': 'secret'}}
# uuid.uuid4()


@app.route('/', methods=['GET'])
def index():
    # インデックスページを表示する
    response = make_response(render_template('index2.html', test='myfood'))
    return add_allow_origin(response)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # ログイン処理
    if request.method == 'POST' and request.form.get('email'):
        # セッションにユーザ名を保存してからインデックスページにリダイレクトする
        email = request.form['email']
        json_return = request.form.get('json') is not None
        if email in users and request.form['pw'] == users[email]['pw']:
            user = User()
            user.id = email
            flask_login.login_user(user)
            if json_return:
                return add_allow_origin(jsonify({
                    'status': "success",
                    'user': email
                }))
            return redirect(url_for('protected'))
        if json_return:
            return add_allow_origin(jsonify({
                'status': "error"
            }))
    return redirect(url_for('index'))


@app.route('/logout', methods=['GET'])
def logout():
    flask_login.logout_user()
    if request.args.get('json'):
        return add_allow_origin(jsonify({'status': "success"}))
    # ログインページにリダイレクトする
    return redirect(url_for('index'))


@app.route('/account', methods=['GET'])
def account():
    result = {}
    if flask_login.current_user.is_authenticated:
        result['account'] = flask_login.current_user.id
    else:
        result['account'] = None
    return add_allow_origin(jsonify(result))


@app.route('/protected')
@flask_login.login_required
def protected():
    return 'Logged in as: ' + flask_login.current_user.id


@app.route('/test3.html', methods=['GET'])
def test():
    print('test:')
    return add_allow_origin(make_response(render_template('test3.html', categories=const.CATEGORIES)))


@app.route('/<path>', methods=['GET'])
def other(path):
    print('other:%s' % path)
    if path == 'modal.html' or path == 'local.html'\
            or path == 'test.html' or path == 'modal2.html'\
            or path == 'test2.html' or path == 'test3.html':
        # リダイレクト不要ページを表示する
        return add_allow_origin(make_response(render_template(path)))
    print('other:redirect')
    return redirect(url_for('index'))


def add_allow_origin(response):
    if request.headers.get('Origin') is not None:
        origin = request.headers.get('Origin')
    else:
        origin = '*'
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get('email')
    if email not in users:
        return

    user = User()
    user.id = email

    # DO NOT ever store passwords in plaintext and always compare password
    # hashes using constant-time comparison!
    user.is_authenticated = request.form['pw'] == users[email]['pw']

    return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return 'Unauthorized'

if __name__ == '__main__':
    app.run(debug=True)
