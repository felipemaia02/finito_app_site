import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material'
import { useThemeContext } from '@/context/ThemeContext'

export default function SettingsPage() {
  const { mode, toggleMode } = useThemeContext()

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Configurações
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Aparência
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            <ListItem
              secondaryAction={
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleMode}
                      color="primary"
                    />
                  }
                  label=""
                />
              }
              sx={{ px: 0 }}
            >
              <ListItemText
                primary="Modo escuro"
                secondary="Alterna entre tema claro e escuro"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight={700} gutterBottom>
            Sobre
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { label: 'Aplicação', value: 'Finito App' },
              { label: 'Versão front-end', value: '0.1.0' },
              { label: 'API', value: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight={500} fontFamily={item.label === 'API' ? 'monospace' : undefined}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
