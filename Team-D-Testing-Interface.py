import streamlit as st
import requests
import json
from datetime import datetime

# GitHub API Configuration
GITHUB_API_URL = "https://api.github.com"
CLIENT_ID = "Ov23li05rd8WogjIw0yU"  # Your GitHub client ID
CLIENT_SECRET = "09a0159c6f2e3dc84abafa76d0f541449012f9fe"  # Your GitHub client secret
REDIRECT_URI = "http://localhost:8501/callback"  # Redirect URI after authentication (should match GitHub app setup)

# UI Setup
st.title("GitHub Integration Agent Testing Interface")
st.markdown("""
Welcome to the GitHub Integration Testing Interface. Here, you can test various GitHub operations like creating repositories, issues, and pull requests.
""")

# Function to get authorization URL
def get_authorization_url():
    return f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=repo"

# Function to exchange code for OAuth token
def exchange_code_for_token(code):
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    headers = {'Accept': 'application/json'}
    response = requests.post(token_url, data=payload, headers=headers)
    response_data = response.json()
    return response_data.get('access_token')

# If the user is already authenticated, show the options to perform GitHub operations
if 'OAUTH_TOKEN' in st.session_state:
    OAUTH_TOKEN = st.session_state.OAUTH_TOKEN
    # Get user info
    user_info = requests.get(f"{GITHUB_API_URL}/user", headers={'Authorization': f'token {OAUTH_TOKEN}'}).json()
    st.sidebar.header(f"Welcome {user_info['login']}")

    # Options for different GitHub operations
    operation = st.selectbox("Choose an operation", ["Create Repository", "Create Issue", "Create Pull Request", "Manage Tasks", "View Notifications"])

    if operation == "Create Repository":
        repo_name = st.text_input("Repository Name")
        repo_description = st.text_area("Repository Description")
        repo_visibility = st.selectbox("Visibility", ["public", "private"])

        if st.button("Create Repository"):
            response = requests.post(f"{GITHUB_API_URL}/user/repos", headers={
                'Authorization': f'token {OAUTH_TOKEN}'}, json={
                'name': repo_name,
                'description': repo_description,
                'private': True if repo_visibility == "private" else False
            })
            if response.status_code == 201:
                st.success(f"Repository {repo_name} created successfully!")
            else:
                st.error("Failed to create repository")

    elif operation == "Create Issue":
        repo = st.text_input("Repository Name")
        issue_title = st.text_input("Issue Title")
        issue_description = st.text_area("Issue Description")
        assignee = st.text_input("Assignee (GitHub Username)")

        if st.button("Create Issue"):
            response = requests.post(f"{GITHUB_API_URL}/repos/{user_info['login']}/{repo}/issues", headers={
                'Authorization': f'token {OAUTH_TOKEN}'}, json={
                'title': issue_title,
                'body': issue_description,
                'assignee': assignee
            })
            if response.status_code == 201:
                st.success(f"Issue '{issue_title}' created successfully!")
            else:
                st.error("Failed to create issue")

    elif operation == "Create Pull Request":
        repo = st.text_input("Repository Name")
        base_branch = st.text_input("Base Branch")
        head_branch = st.text_input("Head Branch")
        pr_title = st.text_input("PR Title")
        pr_description = st.text_area("PR Description")

        if st.button("Create Pull Request"):
            response = requests.post(f"{GITHUB_API_URL}/repos/{user_info['login']}/{repo}/pulls", headers={
                'Authorization': f'token {OAUTH_TOKEN}'}, json={
                'title': pr_title,
                'head': head_branch,
                'base': base_branch,
                'body': pr_description
            })
            if response.status_code == 201:
                st.success(f"Pull Request '{pr_title}' created successfully!")
            else:
                st.error("Failed to create pull request")

    elif operation == "View Notifications":
        # Display notifications for tasks or GitHub activity here (use GitHub events API)
        notifications = requests.get(f"{GITHUB_API_URL}/notifications", headers={
            'Authorization': f'token {OAUTH_TOKEN}'}).json()
        if notifications:
            for notification in notifications:
                st.write(f"**{notification['repository']['name']}**: {notification['subject']['title']}")
        else:
            st.error("No notifications available.")

else:
    # If the user is not authenticated, show GitHub login
    st.sidebar.markdown("## GitHub Authentication")
    st.sidebar.markdown(f"[Authenticate with GitHub]({get_authorization_url()})")
    st.warning("Please authenticate with GitHub to continue.")

    # Capture the authorization code after redirect
    code = st.text_input("Enter the authorization code from GitHub")

    if code:
        OAUTH_TOKEN = exchange_code_for_token(code)
        if OAUTH_TOKEN:
            st.session_state.OAUTH_TOKEN = OAUTH_TOKEN
            st.success("Authentication successful! Now you can perform GitHub operations.")
        else:
            st.error("Failed to authenticate with GitHub.")
