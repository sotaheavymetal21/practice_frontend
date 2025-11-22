'use client'

import { useState } from 'react'
import { signup } from '../login/actions'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert
} from '@mui/material'
import Link from 'next/link'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-yellow-50 to-blue-50 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          className="p-8 md:p-12 backdrop-blur-xl bg-white/90 border border-white/30"
          sx={{ borderRadius: 6, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
        >
          <Typography variant="h3" className="mb-8 font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            新規登録
          </Typography>

          {error && <Alert severity="error" className="mb-6">{error}</Alert>}

          <form action={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="メールアドレス"
              name="email"
              type="email"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="パスワード"
              name="password"
              type="password"
              required
              variant="outlined"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                }
              }}
            >
              {loading ? '登録中...' : '登録'}
            </Button>
          </form>

          <Box className="mt-6 text-center">
            <Typography variant="body2" color="text.secondary">
              すでにアカウントをお持ちの方は{' '}
              <Link href="/login" className="text-purple-600 hover:underline font-semibold">
                ログイン
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
