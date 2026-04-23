import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Receipt as ExpensesIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  LightMode,
  DarkMode,
  Logout,
} from '@mui/icons-material'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useGroup } from '@/hooks/useGroup'
import { useMyGroups } from '@/hooks/useGroups'
import { useThemeContext } from '@/context/ThemeContext'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { label: 'Despesas', icon: <ExpensesIcon />, path: ROUTES.EXPENSES },
  { label: 'Grupos', icon: <GroupIcon />, path: ROUTES.GROUPS },
]

export function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuth()
  const { activeGroupId } = useGroup()
  const { data: allGroups = [] } = useMyGroups()
  const activeGroupName = allGroups.find((g) => g.id === activeGroupId)?.group_name
  const { mode, toggleMode } = useThemeContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const currentNavIndex = navItems.findIndex((i) => i.path === location.pathname)

  function getInitials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // ── Sidebar content (desktop only) ──────────────────────────────────────
  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box component="img" src="/logo_finito.png" alt="Finito" sx={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
          Finito
        </Typography>
      </Box>

      {/* Active group chip */}
      {activeGroupId && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Chip
            label={`Grupo: ${activeGroupName ?? activeGroupId.slice(0, 8) + '...'}`}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => navigate(ROUTES.GROUPS)}
            sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: 2 }}
          />
        </Box>
      )}

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Bottom: theme toggle + user avatar */}
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo escuro'}>
          <IconButton onClick={toggleMode} size="small">
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        <Box sx={{ flex: 1 }} />
        <Tooltip title={user?.name ?? 'Perfil'}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
              {user ? getInitials(user.name) : '?'}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )

  // ── User menu (shared) ───────────────────────────────────────────────────
  const userMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{ sx: { mt: 1, minWidth: 180 } }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" noWrap>{user?.name}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => { navigate(ROUTES.PROFILE); setAnchorEl(null) }}>
        <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
        Perfil
      </MenuItem>
      <MenuItem onClick={() => { navigate(ROUTES.SETTINGS); setAnchorEl(null) }}>
        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
        Configurações
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { logout(); setAnchorEl(null) }} sx={{ color: 'error.main' }}>
        <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
        Sair
      </MenuItem>
    </Menu>
  )

  // ── MOBILE layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <Box component="img" src="/logo_finito.png" alt="Finito" sx={{ width: 28, height: 28, objectFit: 'contain' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', flex: 1 }}>
              Finito
            </Typography>
            {activeGroupId && (
              <Chip
                label={activeGroupName ?? activeGroupId.slice(0, 8) + '...'}
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => navigate(ROUTES.GROUPS)}
              />
            )}
            <IconButton onClick={toggleMode} size="small">
              {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 700 }}>
                {user ? getInitials(user.name) : '?'}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        {userMenu}

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, p: 2, overflow: 'auto', pb: '72px' }}>
          <Outlet />
        </Box>

        {/* Bottom navigation */}
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <BottomNavigation
            value={currentNavIndex === -1 ? false : currentNavIndex}
            onChange={(_, newValue) => navigate(navItems[newValue].path)}
            showLabels
            sx={{ height: 64 }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    )
  }

  // ── DESKTOP layout ───────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: (t) => `1px solid ${t.palette.divider}`,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {userMenu}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box component="main" sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
