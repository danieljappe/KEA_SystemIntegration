import base64

utf8_text = "UTF 8 Encoding"

encodedUTF8Text = utf8_text.encode(encoding='utf-8')

print("Encoded:", encodedUTF8Text)

decodedUTF8Text = encodedUTF8Text.decode('utf-8')

print("Decoded:", decodedUTF8Text)
