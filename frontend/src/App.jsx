import { useState } from 'react'
import {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} from './api'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [requests, setRequests] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const [creating, setCreating] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Неверный username или пароль')
      }

      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      await loadRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadRequests = async () => {
    try {
      setError('')

      const data = await getRequests()

      setRequests(data.results)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleCreateRequest = async (event) => {
    event.preventDefault()

    setError('')
    setCreating(true)

    try {
      await createRequest({
        title,
        description,
        priority,
      })

      resetForm()

      await loadRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleEditRequest = (request) => {
    setEditingId(request.id)
    setTitle(request.title)
    setDescription(request.description)
    setPriority(request.priority)
    setShowForm(true)
    setError('')
  }

  const handleUpdateRequest = async (event) => {
    event.preventDefault()

    setError('')
    setCreating(true)

    try {
      await updateRequest(editingId, {
        title,
        description,
        priority,
      })

      resetForm()

      await loadRequests()
    } catch (error) {
      setError(error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteRequest = async (requestId) => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить эту заявку?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteRequest(requestId)

      await loadRequests()
    } catch (error) {
      setError(error.message)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setEditingId(null)
    setShowForm(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    setRequests(null)
    setUsername('')
    setPassword('')
    setError('')
    resetForm()
  }

  if (requests !== null) {
    return (
      <div className="container mt-5">

        {/* Заголовок и кнопки */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Мои заявки</h2>

          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => {
                if (showForm) {
                  resetForm()
                } else {
                  setShowForm(true)
                  setEditingId(null)
                  setTitle('')
                  setDescription('')
                  setPriority('medium')
                }
              }}
            >
              {showForm ? 'Отмена' : 'Создать заявку'}
            </button>

            <button
              className="btn btn-outline-primary me-2"
              onClick={loadRequests}
            >
              Обновить
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Форма */}
        {showForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-body">

              <h4 className="mb-3">
                {editingId
                  ? 'Редактирование заявки'
                  : 'Новая заявка'}
              </h4>

              <form
                onSubmit={
                  editingId
                    ? handleUpdateRequest
                    : handleCreateRequest
                }
              >

                {/* Название */}
                <div className="mb-3">
                  <label className="form-label">
                    Название
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    minLength={3}
                    maxLength={255}
                    required
                  />
                </div>

                {/* Описание */}
                <div className="mb-3">
                  <label className="form-label">
                    Описание
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    minLength={10}
                    maxLength={5000}
                    required
                  />
                </div>

                {/* Приоритет */}
                <div className="mb-3">
                  <label className="form-label">
                    Приоритет
                  </label>

                  <select
                    className="form-select"
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value)
                    }
                  >
                    <option value="low">
                      Низкий
                    </option>

                    <option value="medium">
                      Средний
                    </option>

                    <option value="high">
                      Высокий
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={creating}
                >
                  {creating
                    ? 'Сохранение...'
                    : editingId
                      ? 'Сохранить изменения'
                      : 'Создать заявку'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Отмена
                </button>

              </form>
            </div>
          </div>
        )}

        {/* Таблица заявок */}
        {requests.length === 0 ? (
          <div className="alert alert-info">
            Заявок пока нет.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Статус</th>
                  <th>Приоритет</th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>

                    <td>
                      {request.id}
                    </td>

                    <td>
                      {request.title}
                    </td>

                    <td>
                      {request.description}
                    </td>

                    <td>
                      {request.status}
                    </td>

                    <td>
                      {request.priority}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          handleEditRequest(request)
                        }
                      >
                        Редактировать
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDeleteRequest(request.id)
                        }
                      >
                        Удалить
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    )
  }

  {/* Страница входа */}
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">
            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Вход
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>

                <div className="mb-3">
                  <label className="form-label">
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App