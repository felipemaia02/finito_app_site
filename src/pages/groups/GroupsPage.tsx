import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Add, Check, Delete, Edit, Group as GroupIcon, PeopleAlt } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useMyGroups, useCreateGroup, useDeleteGroup } from '@/hooks/useGroups'
import { useGroup } from '@/hooks/useGroup'
import { buildGroupDetailPath } from '@/constants/routes'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { GroupResponse } from '@/types/groups'

export default function GroupsPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId, setActiveGroup } = useGroup()

  const { data: groups = [], isLoading, error } = useMyGroups()
  const createMutation = useCreateGroup()
  const deleteMutation = useDeleteGroup()

  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [nameError, setNameError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GroupResponse | null>(null)

  const handleCreate = async () => {
    const trimmed = newName.trim()
    if (!trimmed) { setNameError('Informe o nome do grupo'); return }
    try {
      const created = await createMutation.mutateAsync({ group_name: trimmed })
      enqueueSnackbar('Grupo criado com sucesso!', { variant: 'success' })
      setCreateOpen(false)
      setNewName('')
      setNameError('')
      setActiveGroup(created.id)
      navigate(buildGroupDetailPath(created.id))
    } catch {
      enqueueSnackbar('Erro ao criar grupo', { variant: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      if (activeGroupId === deleteTarget.id) {
        // clear active if deleted
        const next = groups.find((g) => g.id !== deleteTarget.id)
        if (next) setActiveGroup(next.id)
      }
      enqueueSnackbar('Grupo excluído', { variant: 'success' })
      setDeleteTarget(null)
    } catch {
      enqueueSnackbar('Erro ao excluir grupo', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Grupos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gerencie seus grupos de despesas compartilhadas
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
          Novo Grupo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar grupos. Verifique sua conexão.
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && groups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <GroupIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum grupo encontrado
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Crie um grupo para começar a registrar despesas compartilhadas
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
            Criar Primeiro Grupo
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {groups.map((group) => {
          const isActive = group.id === activeGroupId
          return (
            <Card
              key={group.id}
              sx={{
                borderRadius: 3,
                border: isActive ? '2px solid' : '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
              }}
            >
              <CardActionArea onClick={() => navigate(buildGroupDetailPath(group.id))} sx={{ p: 2.5 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          background: isActive
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <GroupIcon sx={{ color: isActive ? 'white' : 'text.secondary', fontSize: 22 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>
                          {group.group_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleAlt sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">
                            {group.users?.length ?? 0} membro{(group.users?.length ?? 0) !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {isActive && (
                      <Chip label="Ativo" size="small" color="primary" icon={<Check />} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                    {group.id}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <Box
                sx={{ display: 'flex', gap: 0.5, px: 2, pb: 1.5, justifyContent: 'flex-end' }}
                onClick={(e) => e.stopPropagation()}
              >
                {!isActive && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => { setActiveGroup(group.id); enqueueSnackbar(`"${group.group_name}" selecionado`, { variant: 'success' }) }}
                    sx={{ borderRadius: 2, fontSize: 12 }}
                  >
                    Selecionar
                  </Button>
                )}
                <Tooltip title="Editar grupo">
                  <IconButton size="small" onClick={() => navigate(buildGroupDetailPath(group.id))}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir grupo">
                  <IconButton size="small" color="error" onClick={() => setDeleteTarget(group)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          )
        })}
      </Box>

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => { setCreateOpen(false); setNewName(''); setNameError('') }} maxWidth="xs" fullWidth>
        <DialogTitle>Novo Grupo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nome do grupo"
            placeholder="Ex: Viagem Europa 2026"
            fullWidth
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setNameError('') }}
            onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
            error={!!nameError}
            helperText={nameError}
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 200 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setCreateOpen(false); setNewName(''); setNameError('') }}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => void handleCreate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? <CircularProgress size={20} /> : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir grupo"
        message={`Tem certeza que deseja excluir o grupo "${deleteTarget?.group_name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
