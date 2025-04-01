from flask import Flask, render_template, request, jsonify
import requests
import simplejson as json
import variables

app = Flask(__name__)

apikey = variables.apikey
header = {'Authorization': f"Key {apikey}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/auth/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    access_token = data.get('accessToken')
    try:
        response = requests.get('https://api.minepi.com/v2/me', headers={'Authorization': f"Bearer {access_token}"})
        if response.status_code == 200:
            return jsonify({'valid': True})
        return jsonify({'valid': False})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)})

@app.route('/payment/approve', methods=['POST'])
def approve_payment():
    payment_id = request.form.get('paymentId')
    access_token = request.form.get('accessToken')
    try:
        response = requests.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/approve",
            headers=header
        )
        return response.text
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment/complete', methods=['POST'])
def complete_payment():
    payment_id = request.form.get('paymentId')
    txid = request.form.get('txid')
    try:
        response = requests.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/complete",
            headers=header,
            data={'txid': txid}
        )
        return response.text
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
