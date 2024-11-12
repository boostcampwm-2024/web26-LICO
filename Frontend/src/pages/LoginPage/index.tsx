import { useAuth } from '@/hooks/useAuth';
import { Naver, Google, Github } from '@/assets/icons/socialLoginIcons';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  return (
    <div className="flex min-h-screen flex-col p-12">
      <div className="mb-3 px-4 font-bold text-2xl text-lico-gray-1">로그인</div>

      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => login('naver')}
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#03C75A] px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Naver size={21} />
              <span className="font-medium">네이버 로그인</span>
            </button>

            <button
              onClick={() => login('google')}
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <Google size={22} />
              <span className="font-medium">구글 로그인</span>
            </button>

            <button
              onClick={() => login('github')}
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292F] px-6 py-3 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Github size={22} />
              <span className="font-medium">깃허브 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
