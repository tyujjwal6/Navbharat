import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Trophy, User, Hash, Crown, Banknote, Calendar, Filter } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

const LuckyDraw = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [allWinners, setAllWinners] = useState([]);
  const [filteredWinners, setFilteredWinners] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  const userdata = JSON.parse(localStorage.getItem("userdata"));
  const loggedInuser_id = userdata?.user_id;

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axiosInstance.get('/draft', {
          params: { alloted: true, allotment_done: true }
        });
        const winnersData = response?.data?.data?.rows || [];
        setAllWinners(winnersData);
        
        // Extract unique dates from the response
        const dates = winnersData
          .map(winner => winner.opening_date)
          .filter(date => date) // Filter out null/undefined dates
          .map(date => getDateString(date)) // Convert to YYYY-MM-DD format using consistent function
          .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
          .sort(); // Sort dates
        
        setAvailableDates(dates);
        
        // Set initial filtered winners to all winners
        setFilteredWinners(winnersData);
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };
    getdata();
  }, []);

  // Filter winners based on selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = allWinners.filter(winner => {
        if (!winner.opening_date) return false;
        const winnerDate = getDateString(winner.opening_date);
        return winnerDate === selectedDate;
      });
      setFilteredWinners(filtered);
      setCurrentIndex(0); // Reset to first winner when filter changes
    } else {
      setFilteredWinners(allWinners);
      setCurrentIndex(0);
    }
  }, [selectedDate, allWinners]);

  // Auto-play effect
  useEffect(() => {
    if (!isPaused && filteredWinners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredWinners.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, filteredWinners.length]);

  const currentWinner = filteredWinners[currentIndex];
  const isMyCard = currentWinner?.user_id == loggedInuser_id;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Extract just the date part (YYYY-MM-DD) to avoid timezone issues
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getDateString = (dateString) => {
    if (!dateString) return '';
    // Extract just the date part (YYYY-MM-DD) to avoid timezone conversion
    return dateString.split('T')[0];
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const clearDateFilter = () => {
    setSelectedDate('');
  };

  if (filteredWinners.length === 0) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">No Winners Found</h2>
            <p className="text-gray-500 mb-4">
              {selectedDate 
                ? `No winners found for ${formatDate(selectedDate + 'T00:00:00.000Z')}`
                : 'No winners available at the moment.'
              }
            </p>
            {selectedDate && (
              <button
                onClick={clearDateFilter}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-2 md:p-4 flex flex-col">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
        
        {/* Header */}
        <div className="text-center mb-3 md:mb-4 flex-shrink-0">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lucky Draw Winners
            </h1>
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
          </div>
          <p className="text-sm md:text-base text-gray-600">Congratulations to all our amazing winners! 🎉</p>
          
          {/* Date Filter Section */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter by Date</span>
              </button>
              
              {showDateFilter && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="">All Dates</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {formatDate(date + 'T00:00:00.000Z')}
                      </option>
                    ))}
                  </select>
                  
                  {selectedDate && (
                    <button
                      onClick={clearDateFilter}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Results count */}
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              {filteredWinners.length} winner{filteredWinners.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
        
        {/* Main Card Section */}
        <div className="flex-1 flex flex-col items-center mb-3 md:mb-4 min-h-0">
          <div 
            className="relative w-full max-w-4xl flex-1 flex flex-col"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Card className={`w-full flex-1 min-h-0 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-xl cursor-pointer ${
              !isPaused ? 'animate-pulse shadow-lg' : 'shadow-xl'
            } ${
              isMyCard 
                ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 ring-2 ring-yellow-200' 
                : 'bg-white border-0'
            } overflow-hidden relative`}>
              <CardContent className="p-3 md:p-4 h-full flex flex-col">
                
                {/* Winner Badge */}
                {isMyCard && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-bl-lg shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span className="font-bold text-xs">That's You!</span>
                    </div>
                  </div>
                )}

                {/* Header with avatar and basic info */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                  <div className="relative">
                    <img
                      src={currentWinner?.profile_image}
                      alt={currentWinner?.name}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-lg ${
                        isMyCard ? 'border-3 border-yellow-400' : 'border-2 border-purple-200'
                      }`}
                    />
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-md ${
                      isMyCard ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {isMyCard ? (
                        <Crown className="w-3 h-3 text-white m-1" />
                      ) : (
                        <Trophy className="w-3 h-3 text-white m-1" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`font-bold text-lg md:text-xl lg:text-2xl mb-2 ${
                      isMyCard ? 'text-yellow-800' : 'text-gray-900'
                    }`}>
                      {currentWinner?.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <User className={`w-4 h-4 ${isMyCard ? 'text-yellow-600' : 'text-gray-500'}`} />
                        <span className={`font-medium ${
                          isMyCard ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          {currentWinner?.user_id}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <Banknote className={`w-4 h-4 ${isMyCard ? 'text-yellow-600' : 'text-gray-500'}`} />
                        <span className={`font-medium ${
                          isMyCard ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          Unit: {currentWinner?.allot}
                        </span>
                      </div>
                      
                      {/* Opening Date */}
                      <div className="flex items-center justify-center sm:justify-start space-x-1 col-span-1 sm:col-span-2">
                        <Calendar className={`w-4 h-4 ${isMyCard ? 'text-yellow-600' : 'text-gray-500'}`} />
                        <span className={`font-medium ${
                          isMyCard ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          Opening: {formatDate(currentWinner?.opening_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Section */}
                <div className={`flex-1 flex items-center justify-center text-center p-4 md:p-6 rounded-xl mb-3 ${
                  isMyCard 
                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-300' 
                    : 'bg-gradient-to-r from-purple-100 to-pink-100'
                }`}>
                  <div className="w-full">
                    <div className="flex justify-center mb-2">
                      <div className={`p-2 md:p-3 rounded-full ${
                        isMyCard ? 'bg-yellow-200' : 'bg-purple-200'
                      }`}>
                        <Gift className={`w-8 h-8 md:w-10 md:h-10 ${
                          isMyCard ? 'text-yellow-600' : 'text-purple-600'
                        }`} />
                      </div>
                    </div>
                    
                    <h4 className={`text-sm md:text-base font-semibold mb-1 ${
                      isMyCard ? 'text-yellow-800' : 'text-gray-700'
                    }`}>
                      Prize Won
                    </h4>
                    
                    <p className={`text-lg md:text-xl lg:text-2xl font-bold ${
                      isMyCard ? 'text-yellow-900' : 'text-purple-800'
                    }`}>
                      {currentWinner?.gift}
                    </p>
                  </div>
                </div>

                {/* Congratulations Message */}
                <div className="text-center">
                  {isMyCard ? (
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white px-4 py-2 rounded-full shadow-lg">
                      <p className="text-sm md:text-base font-bold">🎉 Congratulations! You Won! 🎉</p>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-sm px-4 py-1 bg-purple-100 text-purple-800">
                      🏆 Winner
                    </Badge>
                  )}
                </div>

                {/* Winner Number */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                  <div className={`px-2 py-1 rounded-full ${
                    isMyCard ? 'bg-yellow-100' : 'bg-purple-100'
                  }`}>
                    <span className={`text-xs font-semibold ${
                      isMyCard ? 'text-yellow-700' : 'text-purple-700'
                    }`}>
                      #{currentIndex + 1}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Animation indicator */}
            <div className="text-center mt-2 flex-shrink-0">
              <p className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full inline-block shadow-sm">
                {isPaused ? '⏸️ Paused' : '▶️ Auto-playing'}
              </p>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-2 flex-shrink-0">
            {filteredWinners.map((winner, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? (winner?.user_id == loggedInuser_id ? 'bg-yellow-500 w-6 shadow-md' : 'bg-purple-600 w-6 shadow-md')
                    : 'bg-gray-300 w-2 hover:bg-gray-400 hover:w-3'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Previews */}
        <div className="w-full flex-shrink-0">
          <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-2 px-2 -mx-2 scrollbar-hide">
            {filteredWinners.map((winner, index) => {
              const isPreviewMyCard = winner?.user_id == loggedInuser_id;
              return (
                <div
                  key={`${winner?.user_id}-${index}`}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    index === currentIndex 
                      ? (isPreviewMyCard ? 'ring-2 ring-yellow-500 shadow-lg' : 'ring-2 ring-purple-500 shadow-lg')
                      : 'hover:shadow-md opacity-75 hover:opacity-100'
                  }`}
                >
                  <Card className={`w-44 md:w-48 h-32 md:h-36 border overflow-hidden ${
                    isPreviewMyCard 
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' 
                      : 'bg-white'
                  }`}>
                    <CardContent className="p-2 md:p-3 h-full">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="relative">
                          <img
                            src={winner?.profile_image}
                            alt={winner?.name}
                            className={`w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ${
                              isPreviewMyCard ? 'border border-yellow-400' : 'border border-purple-200'
                            }`}
                          />
                          {isPreviewMyCard && (
                            <Crown className="absolute -top-0.5 -right-0.5 w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-xs md:text-sm truncate ${
                            isPreviewMyCard ? 'text-yellow-800' : 'text-gray-900'
                          }`}>
                            {winner?.name}
                          </h4>
                          <p className={`text-xs truncate ${
                            isPreviewMyCard ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {winner?.user_id}
                          </p>
                        </div>
                        {isPreviewMyCard && (
                          <Badge className="text-xs px-1 py-0 bg-yellow-200 text-yellow-800">
                            You
                          </Badge>
                        )}
                      </div>
                      
                      <div className={`p-1.5 rounded text-center mb-1 ${
                        isPreviewMyCard ? 'bg-yellow-100' : 'bg-purple-50'
                      }`}>
                        <div className="flex items-center justify-center space-x-1">
                          <Gift className={`w-3 h-3 ${
                            isPreviewMyCard ? 'text-yellow-600' : 'text-purple-600'
                          }`} />
                          <p className={`text-xs font-semibold truncate ${
                            isPreviewMyCard ? 'text-yellow-800' : 'text-purple-800'
                          }`}>
                            {winner?.gift}
                          </p>
                        </div>
                      </div>
                      
                      {/* Opening date in preview */}
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className={`w-3 h-3 ${
                          isPreviewMyCard ? 'text-yellow-600' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs truncate ${
                          isPreviewMyCard ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          {formatDate(winner?.opening_date)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;