<template>
  <div id="app">
    <div class="container">
      <h1 class="title">Bitcoin</h1>
      <div class="select-container">
        <h3>Интервал сканирования</h3>
        <select
          @change="SetInterval"
          v-model="selectedInterval[0].minutes"
          id="minutes"
          class="combobox"
        >
          <option value="*">*</option>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <select
          @change="SetInterval"
          v-model="selectedInterval[0].hours"
          id="hours"
          class="combobox"
        >
          <option selected value="*">*</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </div>

      <table class="table">
        <thead>
          <th class="table-child">Date</th>
          <th class="table-child">Price</th>
        </thead>
        <tbody>
          <tr v-for="item in quotes" :key="item.date">
            <td class="table-child">{{ item.date }}</td>
            <td class="table-child">{{ item.price }}$</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      quotes: [],
      selectedInterval: [
        {
          minutes: 5,
          hours: "*",
        },
      ],
      job: Object,
    };
  },
  methods: {
    ScheduleJob() {
      setInterval(async () => {
        this.GetQuotes();
      }, 60000);
    },
    async GetQuotes() {
      this.quotes = await fetch("http://localhost:1337/quotes").then((response) =>
        response.json()
      );
      console.log(this.quotes);
    },
    SetInterval() {
      fetch("http://localhost:1337/set-interval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.selectedInterval),
      });
      console.log(JSON.stringify(this.selectedInterval));
    },
    async GetInterval() {
      this.selectedInterval = await fetch(
        "http://localhost:1337/interval"
      ).then((response) => response.json());
    },
  },
  async beforeMount() {
    await this.GetInterval();
    console.log(this.selectedInterval[0]);
    this.GetQuotes();
    this.ScheduleJob();
  },
};
</script>

<style>
.container {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.combobox {
  margin: 5px;
  height: 30px;
  width: 60px;
}
.table {
  margin: 30px 200px;
  border-spacing: 0;
}
.table-child {
  border: solid 1px gray;
  text-align: center;
}
</style>
