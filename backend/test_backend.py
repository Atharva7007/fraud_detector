import pytest
from fastapi.testclient import TestClient
from backend import app
from utils import get_bert_embedding
from ollama_utils import get_ollama_response
from db import get_mongo_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create test client
client = TestClient(app)

# Test data
TEST_EMAIL = {
    "text": "This is a test email message",
    "email_id": "test@example.com"
}

def test_check_fraud_endpoint():
    """Test the check_fraud endpoint"""
    response = client.post("/check_fraud/", json=TEST_EMAIL)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "confidence" in data
    assert isinstance(data["confidence"], (int, float))
    assert 0 <= data["confidence"] <= 100

def test_report_fraud_endpoint():
    """Test the report_fraud endpoint"""
    response = client.post("/report_fraud/", json=TEST_EMAIL)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "inserted_id" in data
    assert "index" in data
    assert data["message"] == "Fraud reported successfully"

def test_bert_embedding():
    """Test BERT embedding generation"""
    text = "Test message for embedding"
    embedding = get_bert_embedding(text)
    assert embedding is not None
    assert embedding.shape == (768,)  # BERT base uncased embedding size

def test_ollama_response():
    """Test Ollama response generation"""
    prompt = "Test prompt for Ollama"
    response = get_ollama_response(prompt)
    assert response is not None
    assert isinstance(response, str)

def test_mongodb_connection():
    """Test MongoDB connection"""
    client = get_mongo_client()
    assert client is not None
    try:
        # Test the connection by pinging the database
        client.admin.command("ping")
        assert True
    except Exception as e:
        pytest.fail(f"MongoDB connection failed: {str(e)}")

def test_invalid_email_request():
    """Test invalid email request handling"""
    invalid_email = {
        "text": "",  # Empty text
        "email_id": "test@example.com"
    }
    response = client.post("/check_fraud/", json=invalid_email)
    assert response.status_code == 200  # Should still return 200 but with low confidence

def test_missing_email_id():
    """Test request with missing email ID"""
    email_without_id = {
        "text": "Test message",
        "email_id": ""
    }
    response = client.post("/check_fraud/", json=email_without_id)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "confidence" in data 