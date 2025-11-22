import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button, Box, Typography } from '@mui/material'
import { signOut } from '@/app/login/actions'

export default async function AuthButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <Box className="flex items-center gap-4">
      <Typography variant="body2" className="text-gray-600 hidden md:block">
        {user.email}
      </Typography>
      <form action={signOut}>
        <Button
          type="submit"
          variant="outlined"
          size="small"
          sx={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
        >
          ログアウト
        </Button>
      </form>
    </Box>
  ) : (
    <Button
      component={Link}
      href="/login"
      variant="contained"
      size="small"
      sx={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        color: 'white'
      }}
    >
      ログイン
    </Button>
  )
}
