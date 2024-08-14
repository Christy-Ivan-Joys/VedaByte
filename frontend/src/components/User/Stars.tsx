export const getStars = (rating:number) => {
    const filledStars = Math.floor(rating);
    const halfStars = rating % 1 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStars;
  
    return (
      <>
        {[...Array(filledStars)].map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-500 text-xl">&#9733;</span>
        ))}
        {[...Array(halfStars)].map((_, i) => (
          <span key={`half-${i}`} className="text-yellow-500 text-xl">&#9733;</span>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-xl">&#9734;</span>
        ))}
      </>
    );
  };