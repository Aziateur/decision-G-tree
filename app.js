const App = () => {
  const [parameters, setParameters] = React.useState([
    {
      id: '1',
      name: 'Energy Level',
      threshold: 3,
      instruction: 'Complete Energy Management SOP',
      category: 'Physical',
      subParameters: [
        {
          id: '1-1',
          name: 'Mental Energy',
          score: 5,
          weight: 50,
          threshold: 3,
          instruction: 'Complete Mental Energy Sub-SOP'
        },
        {
          id: '1-2',
          name: 'Physical Energy',
          score: 5,
          weight: 50,
          threshold: 3,
          instruction: 'Complete Physical Energy Sub-SOP'
        }
      ]
    }
  ]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [expandedParams, setExpandedParams] = React.useState({});

  // Save to localStorage whenever parameters change
  React.useEffect(() => {
    localStorage.setItem('breakSystemParameters', JSON.stringify(parameters));
  }, [parameters]);

  // Load from localStorage on initial render
  React.useEffect(() => {
    const saved = localStorage.getItem('breakSystemParameters');
    if (saved) {
      setParameters(JSON.parse(saved));
    }
  }, []);

  const calculateParentScore = (subParams) => {
    if (subParams.length === 0) return 0;
    let totalScore = 0;
    let totalWeight = 0;
    
    subParams.forEach(sub => {
      totalScore += (sub.score * sub.weight);
      totalWeight += sub.weight;
    });

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;
  };

  const toggleExpand = (id) => {
    setExpandedParams(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addParameter = () => {
    const newParam = {
      id: Date.now().toString(),
      name: 'New Parameter',
      threshold: 3,
      instruction: '',
      category: 'Other',
      subParameters: []
    };
    setParameters(prev => [...prev, newParam]);
  };

  const addSubParameter = (parentId) => {
    const newSubParam = {
      id: `${parentId}-${Date.now()}`,
      name: 'New Sub-Parameter',
      score: 5,
      weight: 50,
      threshold: 3,
      instruction: ''
    };
    
    setParameters(prev => prev.map(param => {
      if (param.id === parentId) {
        return {
          ...param,
          subParameters: [...param.subParameters, newSubParam]
        };
      }
      return param;
    }));
  };

  const updateSubParameter = (parentId, subId, field, value) => {
    setParameters(prev => prev.map(param => {
      if (param.id === parentId) {
        return {
          ...param,
          subParameters: param.subParameters.map(sub =>
            sub.id === subId ? { ...sub, [field]: field === 'score' ? parseInt(value) : value } : sub
          )
        };
      }
      return param;
    }));
  };

  const getRecommendations = () => {
    const recs = [];
    parameters.forEach(param => {
      const parentScore = calculateParentScore(param.subParameters);
      if (parentScore <= param.threshold) {
        recs.push({
          ...param,
          score: parentScore,
          isParent: true,
          subRecs: param.subParameters.filter(sub => sub.score <= sub.threshold)
        });
      }
    });
    return recs;
  };

  const calculateOverallScore = () => {
    let totalScore = 0;
    let totalWeight = parameters.length;

    parameters.forEach(param => {
      totalScore += calculateParentScore(param.subParameters);
    });

    return totalWeight > 0 ? (totalScore / (totalWeight * 5)) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Break Decision System</h2>
        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            {isEditing ? 'Done Editing' : 'Edit Parameters'}
          </button>
          {isEditing && (
            <button
              onClick={addParameter}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Parameter
            </button>
          )}
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-4 mb-6">
        {parameters.map(param => (
          <div key={param.id} className="parameter-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleExpand(param.id)}>
                  {expandedParams[param.id] ? '▼' : '►'}
                </button>
                <div>
                  <span className="font-bold">{param.name}</span>
                  <span className="text-gray-500 ml-2">({param.category})</span>
                  <span className="ml-4 font-bold">
                    Score: {calculateParentScore(param.subParameters)}
                  </span>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => addSubParameter(param.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Add Sub-Parameter
                </button>
              )}
            </div>

            {expandedParams[param.id] && (
              <div className="ml-8 space-y-4 mt-4">
                {param.subParameters.map(sub => (
                  <div key={sub.id} className="border p-4 rounded">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateSubParameter(param.id, sub.id, 'name', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Sub-Parameter Name"
                        />
                        <div className="flex gap-4">
                          <div>
                            <label className="block text-sm">Weight (%)</label>
                            <input
                              type="number"
                              value={sub.weight}
                              onChange={(e) => updateSubParameter(param.id, sub.id, 'weight', parseInt(e.target.value))}
                              className="w-24 p-2 border rounded"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm">Threshold</label>
                            <input
                              type="number"
                              value={sub.threshold}
                              onChange={(e) => updateSubParameter(param.id, sub.id, 'threshold', parseInt(e.target.value))}
                              className="w-24 p-2 border rounded"
                              min="1"
                              max="5"
                            />
                          </div>
                        </div>
                        <textarea
                          value={sub.instruction}
                          onChange={(e) => updateSubParameter(param.id, sub.id, 'instruction', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Instruction when score is below threshold"
                          rows="2"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span>{sub.name}</span>
                          <span className="text-gray-500 ml-2">(Weight: {sub.weight}%)</span>
                        </div>
                        <select
                          value={sub.score}
                          onChange={(e) => updateSubParameter(param.id, sub.id, 'score', e.target.value)}
                          className="p-2 border rounded"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 border rounded">
        <h3 className="text-lg font-bold mb-4">Results & Recommendations</h3>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span>Overall Score:</span>
            <span className="font-bold">{calculateOverallScore().toFixed(1)}%</span>
          </div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${calculateOverallScore()}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4">
          {getRecommendations().length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-bold">Required Actions:</h3>
              {getRecommendations().map(param => (
                <div key={param.id} className="p-4 bg-yellow-50 rounded">
                  <div>
                    <p className="font-semibold">
                      {param.name} (Score: {param.score}/5)
                    </p>
                    {param.category && (
                      <p className="text-gray-600">Category: {param.category}</p>
                    )}
                    <div className="mt-2 p-3 bg-white rounded border">
                      <p className="text-gray-800">{param.instruction}</p>
                    </div>
                    {param.subRecs && param.subRecs.length > 0 && (
                      <div className="mt-2 ml-4">
                        <p className="font-medium">Contributing factors:</p>
                        {param.subRecs.map(sub => (
                          <div key={sub.id} className="mt-2 p-2 bg-white rounded border">
                            <p className="font-medium">{sub.name} (Score: {sub.score}/5)</p>
                            <p className="text-gray-800 mt-1">{sub.instruction}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600">All parameters are within acceptable ranges.</p>
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
