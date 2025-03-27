from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

PI_API_KEY = "5imutpmtbmkds0ddkp73995did0fmc7julya78qt3kokwfpnhjkpwuwnprs66hfy"
PI_API_URL = "https://api.minepi.com/v2"

header = {
    'Authorization': f"Key {PI_API_KEY}",
    'Content-Type': 'application/json'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/auth/pi', methods=['POST'])
def auth_pi():
    data = request.form
    access_token = data.get('accessToken')
    user = data.get('user')
    if not access_token or not user:
        return jsonify({'status': 'error', 'message': 'Missing accessToken or user data'}), 400
    userheader = {'Authorization': f"Bearer {access_token}"}
    try:
        response = requests.get(f"{PI_API_URL}/me", headers=userheader)
        if response.status_code == 200:
            print(f"User authenticated: {response.text}")
            return jsonify({'status': 'success', 'message': 'User authenticated', 'user': json.loads(user)}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid access token'}), 401
    except Exception as e:
        print(f"Error verifying auth: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/payment/approve', methods=['POST'])
def approve():
    access_token = request.form.get('accessToken')
    userheader = {'Authorization': f"Bearer {access_token}"}
    payment_id = request.form.get('paymentId')
    approve_url = f"{PI_API_URL}/payments/{payment_id}/approve"
    try:
        response = requests.post(approve_url, headers=header)
        user_response = requests.get(f"{PI_API_URL}/me", headers=userheader)
        user_json = json.loads(user_response.text)
        print(f"Approval response: {response.text}, User: {user_json}")
        return response.text
    except Exception as e:
        print(f"Error approving payment: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/payment/complete', methods=['POST'])
def complete():
    access_token = request.form.get('accessToken')
    userheader = {'Authorization': f"Bearer {access_token}"}
    payment_id = request.form.get('paymentId')
    txid = request.form.get('txid')
    debug = request.form.get('debug')
    try:
        user_response = requests.get(f"{PI_API_URL}/me", headers=userheader)
        user_json = json.loads(user_response.text)
        data = {'txid': txid}
        complete_url = f"{PI_API_URL}/payments/{payment_id}/complete"
        response = requests.post(complete_url, headers=header, data=json.dumps(data))
        print(f"Completion response: {response.text}, User: {user_json}")
        if debug == 'cancel':
            return jsonify({'status': 'cancelled', 'message': 'Payment cancelled'}), 200
        return response.text
    except Exception as e:
        print(f"Error completing payment: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/payment/cancel', methods=['POST'])
def cancel():
    payment_id = request.form.get('paymentId')
    cancel_url = f"{PI_API_URL}/payments/{payment_id}/cancel"
    try:
        response = requests.post(cancel_url, headers=header)
        print(f"Cancel response: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error cancelling payment: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/payment/error', methods=['POST'])
def error():
    payment_id = request.form.get('paymentId')
    cancel_url = f"{PI_API_URL}/payments/{payment_id}/cancel"
    try:
        response = requests.post(cancel_url, headers=header)
        print(f"Error response (cancelled): {response.text}")
        return response.text
    except Exception as e:
        print(f"Error handling payment error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/me', methods=['POST'])
def getme():
    user_url = f"{PI_API_URL}/me"
    try:
        response = requests.post(user_url, headers=header)
        print(f"Me response: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error fetching user info: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get_quote', methods=['GET'])
def get_quote():
    return jsonify({'message': 'Placeholder for get_quote'}), 200

@app.route('/back', methods=['GET'])
def back():
    return jsonify({'message': 'Placeholder for back'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
