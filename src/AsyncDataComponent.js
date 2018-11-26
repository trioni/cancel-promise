import React from 'react';

const CANCEL_TOKEN = 'cancelled';

function createToken() {
  const token = {};
  token.promise = new Promise(resolve => {
    token.cancel = (reason) => {
      // the reason property can be checked
      // synchronously to see if you're cancelled
      token.reason = reason;
      resolve(reason);
    };
  });
  return token;
}

const loadData = () => {
  return fetch('https://reqres.in/api/users?delay=3').then((res) => {
    if (res.ok && res.headers.get('Content-Type').includes('application/json')) {
      return res.json();
    }
    return res;
  });
}

class AsyncDataComponent extends React.Component {
  state = { isLoading: false }

  componentDidMount() {
    this.setState({
      isLoading: true
    }, () => {
      this.pending = createToken();
      Promise.race([
        loadData(),
        this.pending.promise,
      ]).then((result) => {
        if (result === CANCEL_TOKEN) {
          throw new Error('cancelled');
        }
        return this.setState({
          data: result,
          isLoading: false,
        })
      }).catch((err) => {
        console.error(err);
      })
    })
  }

  componentWillUnmount() {
    this.pending.cancel(CANCEL_TOKEN);
  }

  render() { 
    const { isLoading, data } = this.state;
    if (isLoading) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <React.Fragment>
        {data && data.data.map((user) => (
          <dl key={user.id} className="User">
            <dt>User</dt>
            <dd>{user.first_name} {user.last_name}</dd>
            <dt>Avatar</dt>
            <dd><img src={user.avatar} alt={`Avatar of ${user.first_name + ' ' + user.last_name}`} /></dd>
          </dl>
        ))}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </React.Fragment>
    )
  }
}
 
export default AsyncDataComponent;