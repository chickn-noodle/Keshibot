import sys
import requests
import os
from dotenv import load_dotenv

load_dotenv()
title = sys.argv[1]
chapNum = sys.argv[2]
volume = sys.argv[3]

if title == "NONE":
    title = None
if volume == "NONE":
    volume = None

# title = "hi"
# chapNum = "10"
# volume = "10"

base_url = "https://api.mangadex.org"
testManga = "f9c33607-9180-4ba6-b85c-e4b5faee7192"
groupID = ["021d6760-cd10-4f40-8bef-0240f53dfc1b"]
clientID = os.getenv("mdexClientID")
clientSecret = os.getenv("clientSecret")
refresh_token = ""
mdexUser = os.getenv("mdexUser")
mdexPass = os.getenv("mdexPass")

# Creds
acessCreds = {
    "grant_type": "password",
    "username": mdexUser,
    "password": mdexPass,
    "client_id": clientID,
    "client_secret": clientSecret
}

refreshCreds = {
    "grant_type": "refresh_token",
    "refresh_token": refresh_token,
    "client_id": clientID,
    "client_secret": clientSecret
}

# refreshing
def refreshToken():
    """
    refresh token
    
    Arguments: None
    
    Returns: refreshed access token
    """
    r = requests.post(
        "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
        data=refreshCreds
    )
    return r.json()["access_token"]

# Log in
r = requests.post(
    "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
    data=acessCreds
)
r_json = r.json()
access_token = r_json["access_token"]
refresh_token = r_json["refresh_token"]

# abandon previous session
r = requests.get(
    f"{base_url}/upload",
    headers={
        "Authorization": f"Bearer {access_token}"
    },
)

if r.ok:
    session_id = r.json()["data"]["id"]
    print("Found a session with ID:", session_id)
    r = requests.delete(
        f"{base_url}/upload/{session_id}",
        headers={
        "Authorization": f"Bearer {access_token}"
        },
    )

    if r.ok:
        print(f"Successfully abandoned session {session_id}.")
    else:
        print(f"Could not abandon session {session_id}, status code: {r.status_code}")

else:
    print("No active session found.")

# Make Post Session
r = requests.post(
    f"{base_url}/upload/begin",
    headers={
        "Authorization": f"Bearer {access_token}"
    },
    json={"groups": groupID, "manga": testManga},
)

if r.ok:
    session_id = r.json()["data"]["id"]
    print(f"Created a new Upload Session with ID: {session_id}")
else:
    print("Another session found, please abandon it before creating a new one.")


# Upload pages

page_map = []
batch_size = 5
folder_path = "./commands/utility/chap-buffer"

for filename in os.listdir(folder_path):
    # omitting non-accepted mimetypes
    if "." not in filename or filename.split(".")[-1].lower() not in ["jpg", "jpeg", "png", "gif"]:
        continue

    page_map.append(
        {
            "filename": filename,
            "extension": filename.split(".")[-1].lower(),
            "path": f"{folder_path}/{filename}",
        }
    )

successful = []
failed = []
batches = [
    page_map[l: l + batch_size]
    for l in range(0, len(page_map), batch_size)
]

for i in range(len(batches)):
    current_batch = batches[i]

    files = [
        (
            f"file{count}",  # the name of the form-data value,
            (
                image["filename"],  # the image's original filename
                open(image["path"], "rb"),  # the image data
                "image/" + image["extension"],  # mime-type
            ),
        )
        for count, image in enumerate(
            current_batch, start=1
        )
    ]

    r = requests.post(
        f"{base_url}/upload/{session_id}",
        headers={
            "Authorization": f"Bearer {access_token}"
        },
        files=files,
    )
    r_json = r.json()

    if r.ok:
        data = r_json["data"]

        for session_file in data:
            successful.append(
                {
                    "id": session_file["id"],
                    "filename": session_file["attributes"]["originalFileName"],
                }
            )

        for image in current_batch:
            if image["filename"] not in [
                page["filename"]
                for page in successful
            ]:
                failed.append(image)

        start = i * batch_size
        end = start + batch_size - 1

        print(
            f"Batch {start}-{end}:",
            "Successful:", len(data), "|",
            "Failed:", len(current_batch) - len(data),
        )
    else:
        print("An error occurred.")
        print(r_json)

successful.sort(key=lambda a: a["filename"])

page_order = [page["id"] for page in successful]

chapter_draft = {
    "volume": volume,
    "chapter": chapNum,
    "translatedLanguage": "en",
    "title": title,
}

r = requests.post(
    f"{base_url}/upload/{session_id}/commit",
    headers={
        "Authorization": f"Bearer {access_token}"
    },
    json={
        "chapterDraft": chapter_draft,
        "pageOrder": page_order,
    },
)

if r.ok:
    print(
        "Upload Session successfully committed, entity ID is:",
        r.json()["data"]["id"],
    )
else:
    print("An error occurred.")
    print(r.json())