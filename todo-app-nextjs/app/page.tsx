import TodoApp from '@/components/TodoApp'
import AuthButton from '@/components/AuthButton'

export default function Home() {
    return (
        <TodoApp headerAction={<AuthButton />} />
    )
}
