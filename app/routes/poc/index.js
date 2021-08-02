import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

// Fake api that resolves after x seconds.
function getFakeData(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, foo: "Hello Ember!" });
    }, 5000);
  });
  // return Promise.resolve();
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default class PocIndexRoute extends Route {
  @service fastboot;
  id = '123';
  model() {
    let shoebox = this.fastboot.shoebox;
    let isFastBoot = this.fastboot.isFastBoot;

    console.info('isFastboot', isFastBoot);

    if (isFastBoot) {
      return getFakeData(this.id).then(async (data) => {
        await wait(1000);
        // Stream the data here
        shoebox.stream('ss', JSON.stringify(data));
        shoebox.stream('something-else-id', JSON.stringify({id: this.id, foo: "bar" }));
        return data;
      });
    }

    // await wait(100);
    console.info('SHOEBOX', shoebox);
    return shoebox && shoebox.retrieve(this.id);
  }
}


  // <code style="display: none;" id=shoebox-123> {"id":123,"foo":"Hello Ember!"}</code>
  // <code style="display: none;" id=shoebox-123> {"id":123,"foo":"bar"} </code>
  // <script type="x/boundary" id="fastboot-body-start"></script>
/*  Usual way:
    const shoebox = this.fastboot.shoebox;
    let shoeboxStore = shoebox.retrieve('my-store');
    const isFastBoot = this.fastboot.isFastBoot;

    const PERSON_ID = 2;

    if (isFastBoot) {
      return this.store.find('person', PERSON_ID).then((data) => {
        if (!shoeboxStore) {
          shoeboxStore = {};
          shoebox.put('my-store', shoeboxStore);
        }

        shoeboxStore[PERSON_ID] = JSON.stringify(data);
      });
    }

    console.info('SHOEBOX', shoeboxStore);

    return shoeboxStore && shoeboxStore[PERSON_ID];
*/