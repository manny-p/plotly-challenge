// noinspection ES6ConvertVarToLetConst,JSSuspiciousNameCombination,JSUnresolvedVariable

function init() {

    d3.json('samples.json').then(data => {

        var ids = data.names
        var sample = data.samples[0]
        var sample_values = sample.sample_values
        var otu_ids = sample.otu_ids
        var otu_labels = sample.otu_labels
        var metadata = data.metadata[0]
        var wfreq = metadata.wfreq

        var counter = 0
        for (let i = 0; i < ids.length; i++){
            const id = ids[i];
            d3.select('#selDataset').append('option').attr('value', `${counter}`).text(id)
            counter += 1
        }
        let topS_values = sample_values.slice(0, 10).reverse(), topOtu_ids = otu_ids.slice(0, 10).reverse(),
            topOtu_labels = otu_labels.slice(0, 10).reverse(), stringOtu_ids = [];
        topOtu_ids.forEach(function (num) {
            stringOtu_ids.push(`OTU ${num}`)
        })

        data = [{
            type: 'bar',
            orientation: 'h',
            x: topS_values,
            y: stringOtu_ids,
            text: topOtu_labels,
            marker: {color: ['#EAF2F8', '#D4E6F1', '#A9CCE3', '#7FB3D5', '#5499C7', '#2980B9', '#2471A3', '#1F618D', '#1A5276', '#154360']}
        }]

        let layout = {
            title: {text: 'Top 10 Bacteria Cultures Found', font: {size: 20}},
            xaxis: {title: 'Total in Sample'}
        }

        Plotly.newPlot('bar', data, layout)

        data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }]

        layout = {
            title: {text: 'Bacteria Cultures per sample', font: {size: 24}},
            xaxis: {title: 'OTU id'}
        }

        Plotly.newPlot('bubble', data, layout)

        Object.entries(metadata).forEach(([key, value]) =>
            d3.select('#sample-metadata').append('p').attr('style', 'font-weight: bold').text(`${key}: ${value}`))

        data = [
            {
                type: 'indicator',
                mode: 'gauge',
                value: wfreq,
                title: {text: 'Scrubs per Week', font: {size: 24}},
                gauge: {
                    axis: {
                        range: [0, 9],
                        tickmode: 'linear',
                        tick0: 0,
                        dtick: 1,
                        tickwidth: 2
                    },
                    bar: {color: '#D2B4DE'},
                    borderwidth: 2,
                    bordercolor: 'gray',
                    steps: [
                        {range: [0, 1], color: '#E8F6F3'},
                        {range: [1, 2], color: '#D0ECE7'},
                        {range: [2, 3], color: '#A2D9CE'},
                        {range: [3, 4], color: '#73C6B6'},
                        {range: [4, 5], color: '#45B39D'},
                        {range: [5, 6], color: '#16A085'},
                        {range: [6, 7], color: '#138D75'},
                        {range: [7, 8], color: '#117A65'},
                        {range: [8, 9], color: '#0E6655'}
                    ]
                }
            }
        ]

        layout = {
            title: 'Belly Button Washing Frequency', font: {size: 18}
        }

        Plotly.newPlot('gauge', data, layout)
    })
}


const optionChanged = () => {
    var selection = d3.select('#selDataset').property('value')
    console.log(selection)

    d3.json('samples.json').then(function (data) {

        var sample = data.samples[`${selection}`]
        var sample_values = sample.sample_values
        var otu_ids = sample.otu_ids
        var otu_labels = sample.otu_labels
        var metadata = data.metadata[`${selection}`]
        var wfreq = metadata.wfreq
        console.log(sample)

        let topS_values = sample_values.slice(0, 10).reverse()
        let topOtu_ids = otu_ids.slice(0, 10).reverse()
        let topOtu_labels = otu_labels.slice(0, 10).reverse()

        let stringOtu_ids = []
        topOtu_ids.forEach(function (num) {
            stringOtu_ids.push(`OTU ${num}`)
        })

        Plotly.restyle('bar', 'x', [topS_values])
        Plotly.restyle('bar', 'y', [stringOtu_ids])
        Plotly.restyle('bar', 'text', [topOtu_labels])

        Plotly.restyle('bubble', 'x', [otu_ids])
        Plotly.restyle('bubble', 'y', [sample_values])
        Plotly.restyle('bubble', 'text', [otu_labels])
        Plotly.restyle('bubble', 'marker.color', [otu_ids])
        Plotly.restyle('bubble', 'marker.size', [sample_values])

        d3.select('#sample-metadata').selectAll('p').remove()

        Object.entries(metadata).forEach(([key, value]) =>
            d3.select('#sample-metadata').append('p').attr('style', 'font-weight: bold').text(`${key}: ${value}`))

        Plotly.restyle('gauge', 'value', [wfreq])

    })
}

init()