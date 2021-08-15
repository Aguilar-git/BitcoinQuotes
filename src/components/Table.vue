<template>
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
</template>

<script>
import schedule from "node-schedule";

export default {
  data() {
    return {
      quotes: [],
    };
  },
  props: {
    interval: Array,
  },
  methods: {
    ScheduleJob() {
      let timeString = "";

      this.interval[0].minutes != "*"
        ? (timeString += `*/${this.interval[0].minutes} `)
        : (timeString += "* ");
      this.interval[0].hours != "*"
        ? (timeString += `*/${this.interval[0].hours} * * *`)
        : (timeString += "* * * *");

      schedule.scheduleJob(timeString, async () => {
        this.SetQuotes();
      });
    },
    RecurrenceJob() {
      const rule = new schedule.RecurrenceRule();
      if (this.interval[0].minutes != "*") rule.minute = this.interval[0].minutes;
      if (this.interval[0].hours != "*") rule.hour = this.interval[0].hours;
      schedule.scheduleJob(rule, async () => {
        this.SetQuotes();
      });
      console.log("Таймер обновлён.");
    },
    async SetQuotes() {
      this.quotes = await fetch("http://localhost:1337/quotes").then((response) =>
        response.json()
      );
      console.log(this.quotes);
    },
  },
  mounted() {
    this.ScheduleJob();
    this.SetQuotes();
  },
};
</script>

<style>
.table {
  margin: 30px 200px;
  border-spacing: 0;
}
.table-child {
  border: solid 1px gray;
  text-align: center;
}
</style>
