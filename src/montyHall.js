(() => {
  const data = []
  var app = new Vue({
    el: '#app',

    data: {
      score: {
        wins: 0,
        total: 0
      },
    },

    computed: {
      getScore () {
        if (this.score.total === 0) {
          return 0
        }
        return (this.score.wins / this.score.total)
      },

      getLosses () {
        return this.score.total - this.score.wins
      }
    },

    mounted () {
      const svg = d3.select(document.getElementById('svg'))
        .append('svg')
        .attr('width', 500)
        .attr('height', 270)
        .append('g')
        .attr('transform', 'translate(0, 10)')

      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("win percentage")

      const x = d3.scaleLinear().range([0, 430])
      const y = d3.scaleLinear().range([100, 0])

      d3.axisLeft().scale(x)
      d3.axisTop().scale(y)
      x.domain(d3.extent(data, (d, i) => i))
      y.domain([0, d3.max(data, d => d)])

      const createPath = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))

      const yAxis = d3.scaleLinear().range([100, 0])

      svg.append("g")
        .call(d3.axisLeft(yAxis))

      svg.append('path').attr('d', createPath(data))

      setInterval(this.run, 1000)
    },

    methods: {
      run () {
        const winner = this.random()
        const firstPick = this.random()

        if (winner !== firstPick) {
          this.score.wins++
        }

        this.score.total++
        data.push(this.score.wins / this.score.total)
        this.redraw()
      },

      random () {
        return Math.floor(Math.random() * 3) + 1
      },

      redraw () {
        const x = d3.scaleLinear().range([0, 430])
        const y = d3.scaleLinear().range([210, 0])
        x.domain(d3.extent(data, (d, i) => i))
        y.domain([0, d3.max(data, d => d)])
        const createPath = d3.line()
          .x((d, i) => x(i))
          .y(d => y(d))
        const svg = d3.select(document.getElementById('svg')).transition()
        svg.select('path').attr('d', createPath(data))
      }
    }
  })
})()