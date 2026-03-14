import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] bg-[#0a0a0a] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-2xl">⚡</span>
              <span className="text-white">Grade</span>
              <span className="text-[#ffd700]">Vault</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              AI-powered TCG card grading. Instant, accurate, animated. The community platform for serious collectors.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-[#ffd700] transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-[#ffd700] transition-colors text-sm">Discord</a>
              <a href="#" className="text-gray-500 hover:text-[#ffd700] transition-colors text-sm">Instagram</a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Features</h3>
            <div className="flex flex-col gap-2">
              <Link href="/grade" className="text-gray-400 hover:text-white text-sm transition-colors">AI Grading</Link>
              <Link href="/binder" className="text-gray-400 hover:text-white text-sm transition-colors">Digital Binder</Link>
              <Link href="/leaderboards" className="text-gray-400 hover:text-white text-sm transition-colors">Leaderboards</Link>
              <Link href="/newsletter" className="text-gray-400 hover:text-white text-sm transition-colors">Restoration</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Legal</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1e1e1e] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} GradeVault. Not affiliated with Nintendo or The Pokémon Company.</p>
          <p className="text-gray-600 text-xs">Built with Claude AI ⚡</p>
        </div>
      </div>
    </footer>
  )
}
