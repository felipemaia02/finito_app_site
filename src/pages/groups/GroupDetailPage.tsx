import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  Check,
  Delete,
  Edit,
  Group as GroupIcon,
  PersonAdd,
  PersonRemove,
  Save,
  Search,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import {
  useGroupDetail,
  useUpdateGroup,
  useDeleteGroup,
  useAddUserToGroup,
  useRemoveUserFromGroup,
} from '@/hooks/useGroups'
import { useGroup } from '@/hooks/useGroup'
import { ROUTES } from '@/constants/routes'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { userService } from '@/services/userService'
import type { UserResponse } from '@/types/users'

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId, setActiveGroup, clearActiveGroup } = useGroup()

  const { data: group, isLoading, error } = useGroupDetail(id ?? null)
  const updateMutation = useUpdateGroup(id ?? '')
  const deleteMutation = useDeleteGroup()
  const addUserMutation = useAddUserToGroup(id ?? '')
  const removeUserMutation = useRemoveUserFromGroup(id ?? '')

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [foundUser, setFoundUser] = useState<UserResponse | null>(null)
  const [searching, setSearching] = useState(false)
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false)
  const [removeUserTarget, setRemoveUserTarget] = useState<{ id: string; name: string } | null>(null)

  const isActive = activeGroupId === id

  const handleStartEdit = () => {
    setNameInput(group?.group_name ?? '')
    setNameError('')
    setEditingName(true)
  }

  const handleSaveName = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed) { setNameError('O nome não pode ser vazio'); return }
    try {
      await updateMutation.mutateAsync({ group_name: trimmed })
      enqueueSnackbar('Nome atualizado!', { variant: 'success' })
      setEditingName(false)
    } catch {
      enqueueSnackbar('Erro ao atualizar nome', { variant: 'error' })
    }
  }

  const handleSearchUser = async () => {
    const trimmed = emailInput.trim()
    if (!trimmed) { setEmailError('Informe o e-mail do usuário'); return }
    setFoundUser(null)
    setSearching(true)
    setEmailError('')
    try {
      const user = await userService.getByEmail(trimmed)
      const alreadyMember = group?.users?.some((u) => u.id === user.id)
      if (alreadyMember) {
        setEmailError('Este usuário já é membro do grupo')
      } else {
        setFoundUser(user)
      }
    } catch {
      setEmailError('Nenhum usuário encontrado com este e-mail')
    } finally {
      setSearching(false)
    }
  }

  const handleAddUser = async () => {
    if (!foundUser) return
    try {
      await addUserMutation.mutateAsync({ user_id: foundUser.id })
      enqueueSnackbar(`${foundUser.name} adicionado ao grupo!`, { variant: 'success' })
      setEmailInput('')
      setFoundUser(null)
    } catch {
      enqueueSnackbar('Erro ao adicionar usuário', { variant: 'error' })
    }
  }

  const handleRemoveUser = async () => {
    if (!removeUserTarget) return
    try {
      await removeUserMutation.mutateAsync(removeUserTarget.id)
      enqueueSnackbar('Usuário removido', { variant: 'success' })
      setRemoveUserTarget(null)
    } catch {
      enqueueSnackbar('Erro ao remover usuário', { variant: 'error' })
    }
  }

  const handleDeleteGroup = async () => {
    try {
      await deleteMutation.mutateAsync(id!)
      if (activeGroupId === id) clearActiveGroup()
      enqueueSnackbar('Grupo excluído', { variant: 'success' })
      navigate(ROUTES.GROUPS)
    } catch {
      enqueueSnackbar('Erro ao excluir grupo', { variant: 'error' })
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !group) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(ROUTES.GROUPS)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Alert severity="error">Grupo não encontrado ou erro ao carregar.</Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Button startIcon={<ArrowBack />} onClick={() => navigate(ROUTES.GROUPS)} sx={{ mb: 2 }}>
        Grupos
      </Button>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GroupIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            {editingName ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  autoFocus
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setNameError('') }}
                  onKeyDown={(e) => { if (e.key === 'Enter') void handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                  error={!!nameError}
                  helperText={nameError}
                  size="small"
                  inputProps={{ maxLength: 200 }}
                  sx={{ minWidth: 240 }}
                />
                <IconButton color="primary" onClick={() => void handleSaveName()} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <CircularProgress size={20} /> : <Save />}
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" fontWeight={700}>{group.group_name}</Typography>
                <Tooltip title="Renomear">
                  <IconButton size="small" onClick={handleStartEdit}><Edit fontSize="small" /></IconButton>
                </Tooltip>
                {isActive && <Chip label="Ativo" size="small" color="primary" icon={<Check />} />}
              </Box>
            )}
            <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
              {group.id}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {!isActive && (
            <Button
              variant="contained"
              startIcon={<Check />}
              onClick={() => { setActiveGroup(group.id); enqueueSnackbar(`"${group.group_name}" selecionado como grupo ativo`, { variant: 'success' }) }}
            >
              Selecionar como Ativo
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteGroupOpen(true)}
          >
            Excluir Grupo
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Members list */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700}>
              Membros ({group.users?.length ?? 0})
            </Typography>
          </Box>
          <Divider />
          {(group.users?.length ?? 0) === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" color="text.secondary">Nenhum membro no grupo</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {group.users.map((user, idx) => (
                <ListItem
                  key={user.id}
                  divider={idx < group.users.length - 1}
                  secondaryAction={
                    <Tooltip title="Remover do grupo">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setRemoveUserTarget({ id: user.id, name: user.name })}
                        disabled={removeUserMutation.isPending}
                      >
                        <PersonRemove fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ px: 3 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: 'primary.main' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 600, variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Add member */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            height: 'fit-content',
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Adicionar Membro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Busque o usuário pelo e-mail para adicioná-lo ao grupo.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              label="E-mail do usuário"
              placeholder="usuario@exemplo.com"
              type="email"
              fullWidth
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); setFoundUser(null) }}
              onKeyDown={(e) => e.key === 'Enter' && void handleSearchUser()}
              error={!!emailError}
              helperText={emailError}
              disabled={searching || addUserMutation.isPending}
              inputProps={{ maxLength: 200 }}
            />
            <Button
              variant="outlined"
              onClick={() => void handleSearchUser()}
              disabled={searching || !emailInput.trim() || addUserMutation.isPending}
              sx={{ flexShrink: 0, height: 56 }}
              startIcon={searching ? <CircularProgress size={16} /> : <Search />}
            >
              Buscar
            </Button>
          </Box>

          {foundUser && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'success.main',
                borderRadius: 2,
                bgcolor: 'success.50',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main', fontSize: 14 }}>
                {foundUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{foundUser.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{foundUser.email}</Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={addUserMutation.isPending ? <CircularProgress size={14} /> : <PersonAdd />}
                onClick={() => void handleAddUser()}
                disabled={addUserMutation.isPending}
                sx={{ flexShrink: 0 }}
              >
                Adicionar
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Delete group confirm */}
      <ConfirmDialog
        open={deleteGroupOpen}
        title="Excluir grupo"
        message={`Tem certeza que deseja excluir o grupo "${group.group_name}"? Todas as despesas associadas serão mantidas, mas o grupo será removido.`}
        confirmLabel="Excluir grupo"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDeleteGroup()}
        onCancel={() => setDeleteGroupOpen(false)}
      />

      {/* Remove user confirm */}
      <ConfirmDialog
        open={!!removeUserTarget}
        title="Remover membro"
        message={`Remover "${removeUserTarget?.name}" do grupo "${group.group_name}"?`}
        confirmLabel="Remover"
        danger
        loading={removeUserMutation.isPending}
        onConfirm={() => void handleRemoveUser()}
        onCancel={() => setRemoveUserTarget(null)}
      />
    </Box>
  )
}
