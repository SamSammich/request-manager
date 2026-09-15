const API_URL = 'http://127.0.0.1:8000'

export async function getCurrentUser() {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/api/auth/users/me/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Не удалось получить данные пользователя'
    )
  }

  return data
}

export async function getUserStatistics() {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/api/auth/users/statistics/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Не удалось загрузить пользователей'
    )
  }

  return data
}

export async function registerUser(userData) {
  const response = await fetch(
    `${API_URL}/api/auth/register/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.username?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      'Не удалось зарегистрировать пользователя'
    )
  }

  return data
}

export async function getRequests(params = {}) {
  const token = localStorage.getItem('access_token')

  const query = new URLSearchParams()

  if (params.search) {
    query.append('search', params.search)
  }

  if (params.status) {
    query.append('status', params.status)
  }

  if (params.priority) {
    query.append('priority', params.priority)
  }

  if (params.created_date) {
    query.append('created_date', params.created_date)
  }

  if (params.page) {
    query.append('page', params.page)
  }

  const queryString = query.toString()

  const url = queryString
    ? `${API_URL}/api/auth/requests/?${queryString}`
    : `${API_URL}/api/auth/requests/`

  const response = await fetch(url, {
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

  const response = await fetch(
    `${API_URL}/api/auth/requests/`,
    {
      method: 'POST',
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

export async function updateRequestStatus(requestId, newStatus) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}/api/auth/requests/${requestId}/status/`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Не удалось изменить статус'
    )
  }

  return data
}