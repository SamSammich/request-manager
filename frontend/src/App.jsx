import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getUserStatistics,
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  registerUser,
} from './api'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершена' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
]

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [requests, setRequests] = useState(null)

  const [users, setUsers] = useState([])
  const [usersCount, setUsersCount] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Registration
  const [showRegistration, setShowRegistration] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState('')
  const [registering, setRegistering] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [registerUsername, setRegisterUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] =
    useState('')

  // Request form
  const [showRequestForm, setShowRequestForm] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const [editingRequest, setEditingRequest] = useState(null)

  // Admin panel
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [createdDateFilter, setCreatedDateFilter] = useState('')
  const [page, setPage] = useState(1)

  const [updatingStatusId, setUpdatingStatusId] = useState(null)

  async function loadUserData() {
    const user = await getCurrentUser()

    setCurrentUser(user)

    if (user.is_staff) {
      const statistics = await getUserStatistics()

      setUsers(statistics.users || [])
      setUsersCount(statistics.count || 0)
    } else {
      setUsers([])
      setUsersCount(0)
    }

    return user
  }

  async function loadRequests(pageNumber = 1, filters = {}) {
    const data = await getRequests({
      search: filters.search ?? search,
      status: filters.status ?? statusFilter,
      priority: filters.priority ?? priorityFilter,
      created_date: filters.created_date ?? createdDateFilter,
      page: pageNumber,
    })

    setRequests(data)
    setPage(pageNumber)
  }

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('access_token')

      if (!token) {
        return
      }

      try {
        setLoading(true)
        setError('')

        await loadUserData()

        await loadRequests(1, {
          search: '',
          status: '',
          priority: '',
          created_date: '',
        })
      } catch (error) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        setCurrentUser(null)
        setRequests(null)
        setUsers([])
        setUsersCount(0)

        setError('Сессия истекла. Войдите снова.')
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      setRegistrationSuccess('')

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
        throw new Error(
          data.detail || 'Неверный логин или пароль'
        )
      }

      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      const user = await loadUserData()

      await loadRequests(1, {
        search: '',
        status: '',
        priority: '',
        created_date: '',
      })

      setUsername('')
      setPassword('')
      setRegistrationSuccess('')

      console.log('Вход выполнен:', user)
    } catch (error) {
      setError(error.message)
      setCurrentUser(null)
      setRequests(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(event) {
    event.preventDefault()

    setError('')
    setRegistrationSuccess('')

    if (registerPassword !== registerPasswordConfirm) {
      setError('Пароли не совпадают')
      return
    }

    if (registerPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      setRegistering(true)

      await registerUser({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      })

      setRegisterUsername('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterPasswordConfirm('')

      setShowRegistration(false)

      setRegistrationSuccess(
        'Регистрация прошла успешно. Теперь войдите в систему.'
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setRegistering(false)
    }
  }

  function openRegistration() {
    setError('')
    setRegistrationSuccess('')
    setShowRegistration(true)
  }

  function openLogin() {
    setError('')
    setRegistrationSuccess('')
    setShowRegistration(false)
  }

  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    setCurrentUser(null)
    setRequests(null)
    setUsers([])
    setUsersCount(0)

    setUsername('')
    setPassword('')
    setError('')
    setRegistrationSuccess('')

    setShowRequestForm(false)
    setShowAdminPanel(false)
    setEditingRequest(null)
  }

  function openCreateForm() {
    setEditingRequest(null)

    setTitle('')
    setDescription('')
    setPriority('medium')

    setError('')
    setShowRequestForm(true)
  }

  function closeRequestForm() {
    setShowRequestForm(false)
    setEditingRequest(null)

    setTitle('')
    setDescription('')
    setPriority('medium')

    setError('')
  }

  async function handleCreateRequest(event) {
    event.preventDefault()

    try {
      setError('')

      await createRequest({
        title,
        description,
        priority,
      })

      setTitle('')
      setDescription('')
      setPriority('medium')

      setShowRequestForm(false)

      await loadRequests(1)
    } catch (error) {
      setError(error.message)
    }
  }

  function startEditing(request) {
    setEditingRequest(request)

    setTitle(request.title)
    setDescription(request.description)
    setPriority(request.priority)

    setShowRequestForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function cancelEditing() {
    setEditingRequest(null)
    setShowRequestForm(false)

    setTitle('')
    setDescription('')
    setPriority('medium')
  }

  async function handleUpdateRequest(event) {
    event.preventDefault()

    try {
      setError('')

      await updateRequest(editingRequest.id, {
        title,
        description,
        priority,
      })

      cancelEditing()

      await loadRequests(page)
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleDeleteRequest(requestId) {
    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить эту заявку?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteRequest(requestId)

      await loadRequests(page)
    } catch (error) {
      setError(error.message)
    }
  }

  async function handleStatusChange(requestId, newStatus) {
    try {
      setError('')
      setUpdatingStatusId(requestId)

      await updateRequestStatus(requestId, newStatus)

      setRequests((currentRequests) => {
        if (!currentRequests) {
          return currentRequests
        }

        return {
          ...currentRequests,
          results: currentRequests.results.map((request) =>
            request.id === requestId
              ? { ...request, status: newStatus }
              : request
          ),
        }
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()

    setPage(1)

    await loadRequests(1, {
      search,
      status: statusFilter,
      priority: priorityFilter,
      created_date: createdDateFilter,
    })
  }

  async function handleFilterChange(
    newStatus = statusFilter,
    newPriority = priorityFilter,
    newCreatedDate = createdDateFilter
  ) {
    setPage(1)

    await loadRequests(1, {
      search,
      status: newStatus,
      priority: newPriority,
      created_date: newCreatedDate,
    })
  }

  async function handlePageChange(newPage) {
    await loadRequests(newPage)
  }

  function resetFilters() {
    setSearch('')
    setStatusFilter('')
    setPriorityFilter('')
    setCreatedDateFilter('')

    setPage(1)

    loadRequests(1, {
      search: '',
      status: '',
      priority: '',
      created_date: '',
    })
  }

  function getStatusLabel(status) {
    const option = STATUS_OPTIONS.find(
      (item) => item.value === status
    )

    return option ? option.label : status
  }

  function getPriorityLabel(priority) {
    const option = PRIORITY_OPTIONS.find(
      (item) => item.value === priority
    )

    return option ? option.label : priority
  }

  if (loading && !currentUser) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div
            className="spinner-border"
            role="status"
          ></div>

          <p className="mt-3">
            Загрузка...
          </p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    if (showRegistration) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4">
                    Регистрация
                  </h2>

                  {error && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label">
                        Username
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={registerUsername}
                        onChange={(event) =>
                          setRegisterUsername(
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={registerEmail}
                        onChange={(event) =>
                          setRegisterEmail(
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Пароль
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={registerPassword}
                        onChange={(event) =>
                          setRegisterPassword(
                            event.target.value
                          )
                        }
                        minLength={8}
                        required
                      />

                      <div className="form-text">
                        Минимум 8 символов
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">
                        Подтвердите пароль
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={registerPasswordConfirm}
                        onChange={(event) =>
                          setRegisterPasswordConfirm(
                            event.target.value
                          )
                        }
                        minLength={8}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={registering}
                    >
                      {registering
                        ? 'Регистрация...'
                        : 'Зарегистрироваться'}
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={openLogin}
                    >
                      Уже есть аккаунт? Войти
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="mb-1 text-center text-dark">
                  Вход в систему
                </h2>

                {registrationSuccess && (
                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    {registrationSuccess}
                  </div>
                )}

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
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

                  <div className="mb-4">
                    <label className="form-label">
                      Пароль
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

                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={openRegistration}
                  >
                    Нет аккаунта? Зарегистрироваться
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1 text-center text-dark">
            Менеджер заявок
          </h1>
          <div className="text-muted">
            Пользователь:{' '}
            <strong>{currentUser.username}</strong>

            {currentUser.is_staff && (
              <span className="badge bg-danger ms-2">
                Администратор
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Main action buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={openCreateForm}
        >
          + Создать заявку
        </button>

        {currentUser.is_staff && (
          <button
            type="button"
            className="btn btn-dark"
            onClick={() =>
              setShowAdminPanel((current) => !current)
            }
          >
            {showAdminPanel
              ? 'Скрыть панель администратора'
              : 'Панель администратора'}
          </button>
        )}
      </div>

      {/* Admin panel */}
      {currentUser.is_staff && showAdminPanel && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                Панель администратора
              </h4>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowAdminPanel(false)}
              >
                Закрыть
              </button>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="border rounded p-3">
                  <div className="text-muted">
                    Всего пользователей
                  </div>

                  <div className="fs-3 fw-bold">
                    {usersCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive mt-4">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Дата регистрации</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email || '—'}</td>
                      <td>
                        {user.is_staff ? 'Да' : 'Нет'}
                      </td>
                      <td>
                        {user.date_joined
                          ? new Date(
                              user.date_joined
                            ).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit request form */}
      {showRequestForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                {editingRequest
                  ? 'Редактировать заявку'
                  : 'Создать заявку'}
              </h4>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={closeRequestForm}
              >
                Закрыть
              </button>
            </div>

            <form
              onSubmit={
                editingRequest
                  ? handleUpdateRequest
                  : handleCreateRequest
              }
            >
              <div className="mb-3">
                <label className="form-label">
                  Заголовок
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
                ></textarea>
              </div>

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
                  {PRIORITY_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingRequest
                    ? 'Сохранить изменения'
                    : 'Создать заявку'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    editingRequest
                      ? cancelEditing
                      : closeRequestForm
                  }
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">
            Поиск и фильтры
          </h4>

          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">
                  Поиск
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Заголовок или описание"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Статус
                </label>

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(event) => {
                    const value = event.target.value
                    setStatusFilter(value)

                    handleFilterChange(
                      value,
                      priorityFilter,
                      createdDateFilter
                    )
                  }}
                >
                  <option value="">
                    Все
                  </option>

                  {STATUS_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Приоритет
                </label>

                <select
                  className="form-select"
                  value={priorityFilter}
                  onChange={(event) => {
                    const value = event.target.value
                    setPriorityFilter(value)

                    handleFilterChange(
                      statusFilter,
                      value,
                      createdDateFilter
                    )
                  }}
                >
                  <option value="">
                    Все
                  </option>

                  {PRIORITY_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Дата
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={createdDateFilter}
                  onChange={(event) => {
                    const value = event.target.value
                    setCreatedDateFilter(value)

                    handleFilterChange(
                      statusFilter,
                      priorityFilter,
                      value
                    )
                  }}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Найти
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetFilters}
                >
                  Сбросить
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Requests */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              Заявки
            </h4>

            {requests && (
              <span className="text-muted">
                Всего: {requests.count}
              </span>
            )}
          </div>

          {!requests ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                role="status"
              ></div>
            </div>
          ) : requests.results.length === 0 ? (
            <div className="alert alert-info">
              Заявок не найдено.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Заголовок</th>
                      <th>Описание</th>
                      <th>Пользователь</th>
                      <th>Статус</th>
                      <th>Приоритет</th>
                      <th>Создана</th>
                      <th>Действия</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.results.map((request) => (
                      <tr key={request.id}>
                        <td>{request.id}</td>

                        <td>
                          <strong>
                            {request.title}
                          </strong>
                        </td>

                        <td>
                          {request.description}
                        </td>

                        <td>
                          {request.username}
                        </td>

                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={request.status}
                            disabled={
                              updatingStatusId ===
                              request.id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                request.id,
                                event.target.value
                              )
                            }
                          >
                            {STATUS_OPTIONS.map(
                              (option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>

                          <small className="text-muted">
                            {getStatusLabel(
                              request.status
                            )}
                          </small>
                        </td>

                        <td>
                          {getPriorityLabel(
                            request.priority
                          )}
                        </td>

                        <td>
                          {request.created_at
                            ? new Date(
                                request.created_at
                              ).toLocaleString()
                            : '—'}
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                startEditing(request)
                              }
                            >
                              Изменить
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteRequest(
                                  request.id
                                )
                              }
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={!requests.previous}
                  onClick={() =>
                    handlePageChange(page - 1)
                  }
                >
                  ← Назад
                </button>

                <span>
                  Страница {page}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={!requests.next}
                  onClick={() =>
                    handlePageChange(page + 1)
                  }
                >
                  Вперёд →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App