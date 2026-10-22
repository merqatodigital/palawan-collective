from fastapi.testclient import TestClient


def _client_with_agent(client: TestClient) -> tuple[dict, dict]:
    customer = client.post("/api/clients", json={"name": "Widget Co", "is_active": True}).json()
    agent = client.post(
        "/api/agents",
        json={
            "client_id": customer["id"],
            "name": "Host",
            "instructions": "",
            "personality": "",
            "model": "",
            "is_active": True,
        },
    ).json()
    return customer, agent


def test_dashboard_counts_the_web_widget_channel(authenticated_client: TestClient):
    """The web chat is a channel of the client like the WhatsApp lines, so the
    dashboard reports it. It has no connection handshake: being enabled is what
    makes it reachable."""
    client = authenticated_client
    customer, agent = _client_with_agent(client)

    assert client.get("/api/dashboard").json()["channels"] == 0

    response = client.put(
        f"/api/webchat/channels/{customer['id']}",
        json={"agent_id": agent["id"], "is_enabled": True},
    )
    assert response.status_code == 200

    dashboard = client.get("/api/dashboard").json()
    assert dashboard["channels"] == 1
    assert dashboard["connected_channels"] == 1


def test_dashboard_does_not_count_a_disabled_web_widget(authenticated_client: TestClient):
    client = authenticated_client
    customer, agent = _client_with_agent(client)

    client.put(
        f"/api/webchat/channels/{customer['id']}",
        json={"agent_id": agent["id"], "is_enabled": False},
    )

    dashboard = client.get("/api/dashboard").json()
    assert dashboard["channels"] == 1
    assert dashboard["connected_channels"] == 0
