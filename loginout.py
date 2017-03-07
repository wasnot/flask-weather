#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, session, request, redirect, render_template, url_for
import uuid

app = Flask(__name__)
# cookie を暗号化する秘密鍵 (本来はランダムに作る)
app.config['SECRET_KEY'] = 'The secret key which ciphers the cookie'


# 各 route() 関数の前に実行される処理
@app.before_request
def before_request():
    # セッションに username が保存されている (= ログイン済み)
    if session.get('bid') is None:
        session['bid'] = uuid.uuid4()
    if session.get('username') is not None:
        return
    # リクエストがログインページに関するもの
    if request.path == '/login':
        return
    if request.path.find('/static') == 0:
        return
    # ログインされておらずログインページに関するリクエストでもなければリダイレクトする
    return redirect('/login')


@app.route('/', methods=['GET'])
def index():
    # インデックスページを表示する
    return render_template('index.html', test='myfood')


@app.route('/login', methods=['GET', 'POST'])
def login():
    # ログイン処理
    if request.method == 'POST' and _is_account_valid():
            # セッションにユーザ名を保存してからインデックスページにリダイレクトする
            session['username'] = request.form['username']
            return redirect(url_for('index'))
    # ログインページを表示する
    return render_template('login.html')


# 正規のアカウントかチェックする関数
def _is_account_valid():
    # リクエストに username が含まれていれば通す
    if request.form.get('username') is None:
        return False
    return True


@app.route('/logout', methods=['GET'])
def logout():
    # セッションからユーザ名を取り除く (ログアウトの状態にする)
    session.pop('username', None)
    # ログインページにリダイレクトする
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
