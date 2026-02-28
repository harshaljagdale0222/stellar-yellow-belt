#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Env, Symbol, Vec, Map, String};

#[contracttype]
pub enum DataKey {
    Poll(u64),
    Vote(u64, String),
    PollCount,
}

#[contracttype]
#[derive(Clone)]
pub struct Poll {
    pub id: u64,
    pub question: String,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub end_time: u64,
    pub creator: String,
}

#[contract]
pub struct LivePollContract;

#[contractimpl]
impl LivePollContract {
    pub fn create_poll(env: Env, question: String, end_time: u64, creator: String) -> u64 {
        let count: u64 = env.storage().instance().get(&DataKey::PollCount).unwrap_or(0);
        let id = count + 1;

        let poll = Poll {
            id,
            question,
            yes_votes: 0,
            no_votes: 0,
            end_time,
            creator,
        };

        env.storage().instance().set(&DataKey::Poll(id), &poll);
        env.storage().instance().set(&DataKey::PollCount, &id);
        id
    }

    pub fn vote(env: Env, poll_id: u64, voter: String, option: Symbol) {
        let mut poll: Poll = env.storage().instance().get(&DataKey::Poll(poll_id)).unwrap();

        let vote_key = DataKey::Vote(poll_id, voter.clone());
        let already_voted: bool = env.storage().instance().has(&vote_key);
        if already_voted {
            panic!("Already voted");
        }

        if option == symbol_short!("yes") {
            poll.yes_votes += 1;
        } else if option == symbol_short!("no") {
            poll.no_votes += 1;
        } else {
            panic!("Invalid option");
        }

        env.storage().instance().set(&DataKey::Poll(poll_id), &poll);
        env.storage().instance().set(&vote_key, &true);
    }

    pub fn get_poll(env: Env, poll_id: u64) -> Poll {
        env.storage().instance().get(&DataKey::Poll(poll_id)).unwrap()
    }

    pub fn get_poll_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::PollCount).unwrap_or(0)
    }
}