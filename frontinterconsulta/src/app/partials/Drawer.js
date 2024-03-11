import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import secureLocalStorage from 'react-secure-storage'
import { usePathname } from 'next/navigation'
import { config } from '../config.js'

const routeConfigs = [
  {
    path: '/casos-clinicos',
    label: 'Casos Clinicos',
    roles: ['médico'],
  },
  {
    path: '/especialistas-disponiveis',
    label: 'Especialistas Disponiveis',
    roles: ['paciente', 'unidade'],
  },
  {
    path: '/unidade-especialista',
    label: 'Inter Gestão',
    roles: ['unidade'],
  },
  {
    path: '/agenda',
    label: 'Agenda',
    roles: ['médico', 'paciente', 'unidade'],
  },
]

export const DrawerComponent = ({ open, onClose, onNavigation }) => {
  const pathname = usePathname()
  const userRoles = [
    secureLocalStorage.getItem('NomeMedico'),
    secureLocalStorage.getItem('NomePaciente'),
    secureLocalStorage.getItem('NomeUnidade'),
  ]
  const userRoleSet = new Set(userRoles.filter(Boolean))

  const filteredRoutes = routeConfigs.filter((config) => {
    if (config.roles.includes('all')) return true
    return config.roles.some((role) => userRoleSet.has(role))
  })

  const listItems = filteredRoutes.map((config) => {
    if (pathname === config.path) {
      return (
        <ListItemButton key={config.path} onClick={() => onNavigation(config.path)}>
          <ListItemText>{config.label}</ListItemText>
        </ListItemButton>
      )
    }
    return null
  }).filter(Boolean)

  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <List>{listItems}</List>
    </Drawer>
  )
}
