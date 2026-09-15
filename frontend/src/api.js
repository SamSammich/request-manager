const API_URL = 'http://127.0.0.1:8000'

export async function getRequests() {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}/api/auth/requests/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error('Не удалось загрузить заявки')
  }

  return data
}

export async function createRequest(requestData) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`${API_URL}/api/auth/requests/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.title?.[0] ||
      data.description?.[0] ||
      'Не удалось создать заявку'
    )
  }

  return data
}

export async function updateRequest(requestId, requestData) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/api/auth/requests/${requestId}/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.title?.[0] ||
      data.description?.[0] ||
      'Не удалось обновить заявку'
    )
  }

  return data
}

export async function deleteRequest(requestId) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/api/auth/requests/${requestId}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    let data = {}

    try {
      data = await response.json()
    } catch {
      // Ответ может быть пустым
    }

    throw new Error(
      data.detail || 'Не удалось удалить заявку'
    )
  }
}