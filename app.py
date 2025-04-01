from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "fukqtl4kyz2ijkjilcx1bfhfnx4f8qcvmllaqajrncetgyvo4z8qotuqcnyorx9x"
HEADERS = {'Authorization': f"Key {API_KEY}"}
escrow_payments = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/back')
def backend():
    return render_template('back.html')

@app.route('/auth/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    access_token = data.get('accessToken')
    try:
        response = requests.get(
            'https://api.minepi.com/v2/me',
            headers={'Authorization': f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return jsonify({'valid': True, 'user': response.json()})
        return jsonify({'valid': False, 'error': 'Invalid token'})
    except Exception as e:
        return jsonify({'valid': False, 'error': str(e)}), 500

@app.route('/payment/approve', methods=['POST'])
def approve_payment():
    payment_id = request.form.get('paymentId')
    access_token = request.form.get('accessToken')
    is_escrow = request.form.get('escrow') == 'true'
    timestamp = request.form.get('timestamp')

    token_response = requests.get(
        'https://api.minepi.com/v2/me',
        headers={'Authorization': f"Bearer {access_token}"}
    )
    if token_response.status_code != 200:
        return jsonify({'error': 'Invalid access token'}), 401

    try:
        response = requests.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/approve",
            headers=HEADERS
        )
        if response.status_code == 200:
            if is_escrow:
                escrow_payments[payment_id] = {
                    'status': 'approved',
                    'access_token': access_token,
                    'timestamp': timestamp
                }
            return jsonify({'success': True, 'message': 'Payment approved'})
        return jsonify({'success': False, 'error': response.text}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment/complete', methods=['POST'])
def complete_payment():
    payment_id = request.form.get('paymentId')
    txid = request.form.get('txid')
    access_token = request.form.get('accessToken')
    is_escrow = request.form.get('escrow') == 'true'

    token_response = requests.get(
        'https://api.minepi.com/v2/me',
        headers={'Authorization': f"Bearer {access_token}"}
    )
    if token_response.status_code != 200:
        return jsonify({'error': 'Invalid access token'}), 401

    try:
        response = requests.post(
            f"https://api.minepi.com/v2/payments/{payment_id}/complete",
            headers=HEADERS,
            data={'txid': txid}
        )
        if response.status_code == 200:
            if is_escrow and payment_id in escrow_payments:
                escrow_payments[payment_id]['status'] = 'completed'
                escrow_payments[payment_id]['txid'] = txid
            return jsonify({'success': True, 'message': 'Payment completed'})
        return jsonify({'success': False, 'error': response.text}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment/status/<payment_id>', methods=['GET'])
def get_payment_status(payment_id):
    try:
        if payment_id in escrow_payments:
            return jsonify({'success': True, 'payment': escrow_payments[payment_id]})
        return jsonify({'success': False, 'error': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
