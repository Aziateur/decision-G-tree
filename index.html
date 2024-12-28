<!DOCTYPE html>
<html>
<head>
    <title>Break Decision System</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .parameter-card {
            margin-bottom: 1rem;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
        }
        .score-bar {
            height: 1rem;
            border-radius: 0.5rem;
            background: #e5e7eb;
        }
        .score-fill {
            height: 100%;
            border-radius: 0.5rem;
            background: #3b82f6;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script>
        'use strict';

        const e = React.createElement;

        function App() {
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

            React.useEffect(() => {
                const saved = localStorage.getItem('breakSystemParameters');
                if (saved) {
                    setParameters(JSON.parse(saved));
                }
            }, []);

            React.useEffect(() => {
                localStorage.setItem('breakSystemParameters', JSON.stringify(parameters));
            }, [parameters]);

            function calculateParentScore(subParams) {
                if (subParams.length === 0) return 0;
                let totalScore = 0;
                let totalWeight = 0;
                
                subParams.forEach(sub => {
                    totalScore += (sub.score * sub.weight);
                    totalWeight += sub.weight;
                });

                return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;
            }

            function addParameter() {
                const newParam = {
                    id: Date.now().toString(),
                    name: 'New Parameter',
                    threshold: 3,
                    instruction: '',
                    category: 'Other',
                    subParameters: []
                };
                setParameters(prev => [...prev, newParam]);
            }

            function addSubParameter(parentId) {
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
            }

            function updateSubParameter(parentId, subId, field, value) {
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
            }

            function toggleExpand(id) {
                setExpandedParams(prev => ({
                    ...prev,
                    [id]: !prev[id]
                }));
            }

            function calculateOverallScore() {
                let totalScore = 0;
                let totalWeight = parameters.length;

                parameters.forEach(param => {
                    totalScore += calculateParentScore(param.subParameters);
                });

                return totalWeight > 0 ? (totalScore / (totalWeight * 5)) * 100 : 0;
            }

            function getRecommendations() {
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
            }

            return e('div', { className: 'max-w-4xl mx-auto p-4' },
                e('div', { className: 'mb-4 flex justify-between items-center' },
                    e('h2', { className: 'text-xl font-bold' }, 'Break Decision System'),
                    e('div', null,
                        e('button', {
                            onClick: () => setIsEditing(!isEditing),
                            className: 'px-4 py-2 bg-blue-500 text-white rounded mr-2'
                        }, isEditing ? 'Done Editing' : 'Edit Parameters'),
                        isEditing && e('button', {
                            onClick: addParameter,
                            className: 'px-4 py-2 bg-green-500 text-white rounded'
                        }, 'Add Parameter')
                    )
                ),
                // Parameters section
                parameters.map(param => 
                    e('div', { key: param.id, className: 'parameter-card' },
                        e('div', { className: 'flex items-center justify-between mb-2' },
                            e('div', { className: 'flex items-center gap-2' },
                                e('button', {
                                    onClick: () => toggleExpand(param.id)
                                }, expandedParams[param.id] ? '▼' : '►'),
                                e('div', null,
                                    e('span', { className: 'font-bold' }, param.name),
                                    e('span', { className: 'text-gray-500 ml-2' }, `(${param.category})`),
                                    e('span', { className: 'ml-4 font-bold' },
                                        `Score: ${calculateParentScore(param.subParameters)}`
                                    )
                                )
                            ),
                            isEditing && e('button', {
                                onClick: () => addSubParameter(param.id),
                                className: 'px-2 py-1 bg-green-500 text-white rounded'
                            }, 'Add Sub-Parameter')
                        ),
                        expandedParams[param.id] && e('div', { className: 'ml-8 space-y-4 mt-4' },
                            param.subParameters.map(sub =>
                                e('div', { key: sub.id, className: 'border p-4 rounded' },
                                    isEditing ?
                                        e('div', { className: 'space-y-2' },
                                            e('input', {
                                                type: 'text',
                                                value: sub.name,
                                                onChange: (e) => updateSubParameter(param.id, sub.id, 'name', e.target.value),
                                                className: 'w-full p-2 border rounded',
                                                placeholder: 'Sub-Parameter Name'
                                            }),
                                            e('div', { className: 'flex gap-4' },
                                                e('div', null,
                                                    e('label', { className: 'block text-sm' }, 'Weight (%)'),
                                                    e('input', {
                                                        type: 'number',
                                                        value: sub.weight,
                                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'weight', parseInt(e.target.value)),
                                                        className: 'w-24 p-2 border rounded',
                                                        min: '0',
                                                        max: '100'
                                                    })
                                                ),
                                                e('div', null,
                                                    e('label', { className: 'block text-sm' }, 'Threshold'),
                                                    e('input', {
                                                        type: 'number',
                                                        value: sub.threshold,
                                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'threshold', parseInt(e.target.value)),
                                                        className: 'w-24 p-2 border rounded',
                                                        min: '1',
                                                        max: '5'
                                                    })
                                                )
                                            ),
                                            e('textarea', {
                                                value: sub.instruction,
                                                onChange: (e) => updateSubParameter(param.id, sub.id, 'instruction', e.target.value),
                                                className: 'w-full p-2 border rounded',
                                                placeholder: 'Instruction when score is below threshold',
                                                rows: '2'
                                            })
                                        ) :
                                        e('div', { className: 'flex items-center justify-between' },
                                            e('div', null,
                                                e('span', null, sub.name),
                                                e('span', { className: 'text-gray-500 ml-2' },
                                                    `(Weight: ${sub.weight}%)`
                                                )
                                            ),
                                            e('select', {
                                                value: sub.score,
                                                onChange: (e) => updateSubParameter(param.id, sub.id, 'score', e.target.value),
                                                className: 'p-2 border rounded'
                                            }, [1, 2, 3, 4, 5].map(num =>
                                                e('option', { key: num, value: num }, num)
                                            ))
                                        )
                                )
                            )
                        )
                    )
                ),
                // Recommendations section
                e('div', { className: 'mt-6 p-4 border rounded' },
                    e('h3', { className: 'text-lg font-bold mb-4' }, 'Results & Recommendations'),
                    e('div', { className: 'mb-4' },
                        e('div', { className: 'flex justify-between mb-2' },
                            e('span', null, 'Overall Score:'),
                            e('span', { className: 'font-bold' }, `${calculateOverallScore().toFixed(1)}%`)
                        ),
                        e('div', { className: 'score-bar' },
                            e('div', {
                                className: 'score-fill',
                                style: { width: `${calculateOverallScore()}%` }
                            })
                        )
                    ),
                    e('div', { className: 'mt-4' },
                        getRecommendations().length > 0 ?
                            e('div', { className: 'space-y-4' },
                                e('h3', { className: 'font-bold' }, 'Required Actions:'),
                                getRecommendations().map(param =>
                                    e('div', { key: param.id, className: 'p-4 bg-yellow-50 rounded' },
                                        e('div', null,
                                            e('p', { className: 'font-semibold' },
                                                `${param.name} (Score: ${param.score}/5)`
                                            ),
                                            param.category && e('p', { className: 'text-gray-600' },
                                                `Category: ${param.category}`
                                            ),
                                            e('div', { className: 'mt-2 p-3 bg-white rounded border' },
                                                e('p', { className: 'text-gray-800' }, param.instruction)
                                            ),
                                            param.subRecs && param.subRecs.length > 0 && e('div', { className: 'mt-2 ml-4' },
                                                e('p', { className: 'font-medium' }, 'Contributing factors:'),
                                                param.subRecs.map(sub =>
                                                    e('div', { key: sub.id, className: 'mt-2 p-2 bg-white rounded border' },
                                                        e('p', { className: 'font-medium' },
                                                            `${sub.name} (Score: ${sub.score}/5)`
                                                        ),
                                                        e('p', { className: 'text-gray-800 mt-1' }, sub.instruction)
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            ) :
                            e('p', { className: 'text-green-600' },
                                'All parameters are within acceptable ranges.'
                            )
                    )
                )
            );
        }

        ReactDOM.render(e(App), document.getElementById('root'));
    </script>
</body>
</html>
