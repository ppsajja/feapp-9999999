const styles = {
  primary: 'bg-cyan-600 text-white hover:bg-cyan-700',
  danger:  'bg-red-600 text-white hover:bg-red-700',
  ghost:   'border border-slate-300 text-slate-700 hover:bg-slate-100',
};

function Button({ variant = 'primary', children }) {
  return (
    <button className={`rounded-lg px-4 py-2 font-semibold transition ${styles[variant]}`}>
      {children}
    </button>
  );
}

export default Button;