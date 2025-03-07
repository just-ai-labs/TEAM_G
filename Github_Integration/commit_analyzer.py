import os
from dotenv import load_dotenv
import openai
from typing import List, Dict
import requests
from datetime import datetime, timedelta
import json
import sys

# Load environment variables from .env file
load_dotenv()

# Set your API keys here - consider using environment variables in production
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", '')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

class CommitAnalysis:
    def __init__(self, type: str = "", quality_score: int = 0, insights: str = ""):
        self.type = type
        self.quality_score = quality_score
        self.insights = insights

def fetch_commits(owner: str, repo: str, days: int) -> List[Dict]:
    since_date = (datetime.now() - timedelta(days=days)).isoformat()
    query = """
    query ($owner: String!, $repo: String!, $since: GitTimestamp!) {
      repository(owner: $owner, name: $repo) {
        defaultBranchRef {
          target {
            ... on Commit {
              history(since: $since, first: 100) {
                nodes {
                  id
                  author {
                    email
                    name
                  }
                  message
                  committedDate
                  additions
                  deletions
                  changedFiles
                }
              }
            }
          }
        }
      }
    }
    """
    url = "https://api.github.com/graphql"
    variables = {"owner": owner, "repo": repo, "since": since_date}
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Content-Type": "application/json"}

    response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
    response_data = response.json()

    if response.status_code != 200 or "errors" in response_data:
        raise Exception(f"GitHub API request failed: {response_data}")

    return response_data['data']['repository']['defaultBranchRef']['target']['history']['nodes']

def analyze_commits(commits: List[Dict]) -> Dict[str, CommitAnalysis]:
    analyses = {}
    for commit in commits:
        prompt = f"""Analyze this commit:
        Message: {commit['message']}
        Changes: +{commit['additions']}/-{commit['deletions']} ({commit['changedFiles']} files)

        Respond in JSON format:
        {{"type": "<type>", "quality_score": <score>, "insights": "<insights>"}}
        """

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4-turbo",
                messages=[{"role": "system", "content": "You are an expert code reviewer."}, {"role": "user", "content": prompt}]
            )

            if not response['choices'] or not response['choices'][0]['message']['content']:
                raise ValueError("Empty response from OpenAI API")

            analysis = json.loads(response['choices'][0]['message']['content'])
            analyses[commit['id']] = CommitAnalysis(analysis['type'], analysis['quality_score'], analysis['insights'])
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Failed to decode JSON for commit {commit['id']}: {str(e)}"}))
        except Exception as e:
            print(json.dumps({"error": f"Error analyzing commit {commit['id']}: {str(e)}"}))

    return analyses

def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Failed to parse input JSON: {str(e)}"}))
        sys.exit(1)

    owner, repo, days = input_data['owner'], input_data['repo'], input_data['days']

    try:
        commits = fetch_commits(owner, repo, days)
        analyses = analyze_commits(commits)

        report = {
            "repository": {"owner": owner, "name": repo, "analysis_period_days": days},
            "commits_analyzed": len(commits),
            "analyses": {commit_id: analysis.__dict__ for commit_id, analysis in analyses.items()}
        }

        print(json.dumps(report))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()