const Register = () => {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Sign Up</button>
        </form>
      </div>
    );
  };
  
  export default Register;
  