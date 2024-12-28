const e = React.createElement;

const App = () => {
    const [parameters, setParameters] = React.useState([{
        id: '1',
        name: 'Energy Level',
        threshold: 3,
        instruction: 'Complete Energy Management SOP',
        category: 'Physical',
        subParameters: [{
            id: '1-1',
            name: 'Mental Energy',
            score: 5,
            weight: 50,
            threshold: 3,
            instruction: 'Complete Mental Energy Sub-SOP'
        }, {
            id: '1-2',
            name: 'Physical Energy',
            score: 5,
            weight: 50,
            threshold: 3,
            instruction: 'Complete Physical Energy Sub-SOP'
        }]
    }]);

    const [isEditing, setIsEditing] = React.useState(false);

    const calculateParentScore = (subParams) => {
        if (!subParams?.length) return 0;
        let totalScore = 0, totalWeight = 0;
        subParams.forEach(sub => {
            totalScore += (sub.score * sub.weight);
            totalWeight += sub.weight;
        });
        return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;
    };

    const addParameter = () => {
        const newId = Date.now().toString();
        setParameters(prev => [...prev, {
            id: newId,
            name: 'New Category',
            threshold: 3,
            instruction: '',
            category: '',
            subParameters: [{
                id: `${newId}-1`,
                name: 'New Sub-Parameter',
                score: 5,
                weight: 50,
                threshold: 3,
                instruction: ''
            }]
        }]);
    };

    const deleteParameter = (id) => {
        setParameters(prev => prev.filter(param => param.id !== id));
    };

    const updateParameterName = (id, newName) => {
        setParameters(prev => prev.map(param =>
            param.id === id ? { ...param, name: newName } : param
        ));
    };

    const addSubParameter = (parentId) => {
        setParameters(prev => prev.map(param => {
            if (param.id === parentId) {
                return {
                    ...param,
                    subParameters: [...param.subParameters, {
                        id: `${parentId}-${Date.now()}`,
                        name: 'New Sub-Parameter',
                        score: 5,
                        weight: 50,
                        threshold: 3,
                        instruction: ''
                    }]
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
                        sub.id === subId ? { 
                            ...sub, 
                            [field]: ['score', 'threshold', 'weight'].includes(field) ? parseInt(value) || 0 : value 
                        } : sub
                    )
                };
            }
            return param;
        }));
    };

    return e('div', { className: 'container mx-auto p-4 max-w-3xl bg-gray-50 min-h-screen' }, [
        // Header
        e('div', { className: 'flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md' }, [
            e('h1', { className: 'text-4xl font-bold text-gray-900' }, 'Break Decision System'),
            e('div', { className: 'flex gap-4' }, [
                isEditing && e('button', {
                    onClick: addParameter,
                    className: 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors'
                }, 'Add Category'),
                e('button', {
                    onClick: () => setIsEditing(!isEditing),
                    className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                }, isEditing ? 'Done' : 'Edit')
            ])
        ]),

        // Parameters
        ...parameters.map(param => 
            e('div', { 
                key: param.id,
                className: 'bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-200 ease-in-out hover:shadow-lg'
            }, [
                // Parameter Header
                e('div', { className: 'flex justify-between items-center mb-4' }, [
                    e('div', { className: 'flex-1' }, [
                        isEditing ? 
                            e('input', {
                                type: 'text',
                                value: param.name,
                                onChange: (e) => updateParameterName(param.id, e.target.value),
                                className: 'text-xl font-semibold w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                            }) :
                            e('h2', { className: 'text-xl font-semibold text-gray-800' }, param.name),
                        e('div', { className: 'text-gray-600 mt-1' }, [
                            'Score: ',
                            e('span', {
                                className: `font-semibold ${
                                    calculateParentScore(param.subParameters) <= param.threshold 
                                    ? 'text-red-600' 
                                    : 'text-green-600'
                                }`
                            }, calculateParentScore(param.subParameters))
                        ])
                    ]),
                    isEditing && e('button', {
                        onClick: () => deleteParameter(param.id),
                        className: 'ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'
                    }, 'Delete')
                ]),

                // Sub Parameters
                e('div', { className: 'space-y-4' },
                    param.subParameters.map(sub => {
                        const isBelowThreshold = sub.score <= sub.threshold;
                        return e('div', { 
                            key: sub.id,
                            className: `p-4 rounded-lg transition-all duration-200 ease-in-out ${
                                isBelowThreshold ? 'bg-red-50' : 'bg-gray-50'
                            }`
                        }, 
                            isEditing ?
                            e('div', { className: 'space-y-3' }, [
                                e('input', {
                                    type: 'text',
                                    value: sub.name,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'name', e.target.value),
                                    className: 'w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                                }),
                                e('div', { className: 'flex gap-4' }, [
                                    e('input', {
                                        type: 'number',
                                        value: sub.weight,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'weight', e.target.value),
                                        className: 'w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                                        min: '0',
                                        max: '100'
                                    }),
                                    e('input', {
                                        type: 'text',
                                        value: sub.instruction,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'instruction', e.target.value),
                                        className: 'flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                                        placeholder: 'Instructions'
                                    })
                                ]),
                                e('div', { className: 'flex gap-4' }, [
                                    e('input', {
                                        type: 'number',
                                        value: sub.threshold,
                                        onChange: (e) => updateSubParameter(param.id, sub.id, 'threshold', e.target.value),
                                        className: 'w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                                        min: '1',
                                        max: '5',
                                        placeholder: 'Threshold'
                                    })
                                ])
                            ]) :
                            e('div', { className: 'flex justify-between items-center' }, [
                                e('span', { 
                                    className: `text-lg ${isBelowThreshold ? 'text-red-700' : 'text-gray-700'}`
                                }, `${sub.name} (${sub.weight}%)`),
                                e('select', {
                                    value: sub.score,
                                    onChange: (e) => updateSubParameter(param.id, sub.id, 'score', e.target.value),
                                    className: `ml-4 p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        isBelowThreshold 
                                        ? 'text-red-600 border-red-300 hover:border-red-400' 
                                        : 'text-green-600 border-green-300 hover:border-green-400'
                                    }`
                                }, [1,2,3,4,5].map(n => 
                                    e('option', { key: n, value: n }, n)
                                ))
                            ])
                        );
                    })
                ),

                // Add Sub-Parameter Button
                isEditing && e('button', {
                    onClick: () => addSubParameter(param.id),
                    className: 'mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full transition-colors'
                }, 'Add Sub-Parameter'),

                // Instructions for below threshold parameters
                !isEditing && param.subParameters.some(sub => sub.score <= sub.threshold) &&
                e('div', { className: 'mt-6 p-4 bg-red-50 rounded-lg border border-red-200' }, [
                    e('h3', { className: 'text-lg font-semibold text-red-700 mb-2' }, 'Required Actions:'),
                    e('ul', { className: 'space-y-2' },
                        param.subParameters
                            .filter(sub => sub.score <= sub.threshold)
                            .map(sub => 
                                e('li', { 
                                    key: sub.id,
                                    className: 'text-red-600'
                                }, [
                                    e('span', { className: 'font-medium' }, `${sub.name}: `),
                                    sub.instruction || 'No instruction provided'
                                ])
                            )
                    )
                ])
            ])
        )
    ]);
};

// Initialize the app
ReactDOM.render(e(App), document.getElementById('root'));
