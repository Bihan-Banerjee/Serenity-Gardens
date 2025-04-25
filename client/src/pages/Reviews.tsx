const Reviews = () => {
    return (
      <div className="mt-10 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">What Visitors Say</h2>
        <p className="text-gray-600 text-center mb-6">Read reviews and leave your own feedback!</p>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
          <textarea placeholder="Your Review" className="w-full p-2 border rounded h-24"></textarea>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    );
  };
  
  export default Reviews;
  