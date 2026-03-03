#[derive(Debug, Clone)]
pub struct Poll {
    pub id: String,
    pub question: String,
    pub yes_votes: u32,
    pub no_votes: u32,
}

pub fn create_poll(id: String, question: String) -> Poll {
    Poll {
        id,
        question,
        yes_votes: 0,
        no_votes: 0,
    }
}

pub fn submit_vote(poll: &mut Poll, option: &str) -> bool {
    match option {
        "yes" => {
            poll.yes_votes += 1;
            true
        }
        "no" => {
            poll.no_votes += 1;
            true
        }
        _ => false,
    }
}

pub fn get_total_votes(poll: &Poll) -> u32 {
    poll.yes_votes + poll.no_votes
}

pub fn get_percentage(poll: &Poll) -> (f64, f64) {
    let total = get_total_votes(poll) as f64;
    if total == 0.0 {
        return (0.0, 0.0);
    }
    let yes_percent = (poll.yes_votes as f64 / total) * 100.0;
    let no_percent = (poll.no_votes as f64 / total) * 100.0;
    (yes_percent, no_percent)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_poll_creation() {
        let poll = create_poll(
            "poll_001".to_string(),
            "Is Stellar the future of blockchain?".to_string(),
        );

        assert_eq!(poll.id, "poll_001");
        assert_eq!(poll.question, "Is Stellar the future of blockchain?");
        assert_eq!(poll.yes_votes, 0);
        assert_eq!(poll.no_votes, 0);
    }

    #[test]
    fn test_vote_submission() {
        let mut poll = create_poll(
            "poll_002".to_string(),
            "Do you like voting?".to_string(),
        );

        let vote_yes = submit_vote(&mut poll, "yes");
        let vote_no = submit_vote(&mut poll, "no");

        assert_eq!(vote_yes, true);
        assert_eq!(vote_no, true);
        assert_eq!(poll.yes_votes, 1);
        assert_eq!(poll.no_votes, 1);
    }

    #[test]
    fn test_total_votes() {
        let mut poll = create_poll(
            "poll_003".to_string(),
            "Test question?".to_string(),
        );

        submit_vote(&mut poll, "yes");
        submit_vote(&mut poll, "yes");
        submit_vote(&mut poll, "yes");
        submit_vote(&mut poll, "no");
        submit_vote(&mut poll, "no");

        assert_eq!(get_total_votes(&poll), 5);
        assert_eq!(poll.yes_votes, 3);
        assert_eq!(poll.no_votes, 2);
    }

    #[test]
    fn test_percentage_calculation() {
        let mut poll = create_poll(
            "poll_004".to_string(),
            "Percentage test?".to_string(),
        );

        for _ in 0..5 {
            submit_vote(&mut poll, "yes");
        }
        for _ in 0..3 {
            submit_vote(&mut poll, "no");
        }

        let (yes_percent, no_percent) = get_percentage(&poll);

        assert!(yes_percent > 62.0);
        assert!(yes_percent < 63.0);
        assert!(no_percent > 37.0);
        assert!(no_percent < 38.0);
    }

    #[test]
    fn test_invalid_vote_option() {
        let mut poll = create_poll(
            "poll_005".to_string(),
            "Invalid vote test?".to_string(),
        );

        let invalid_vote = submit_vote(&mut poll, "maybe");

        assert_eq!(invalid_vote, false);
        assert_eq!(poll.yes_votes, 0);
        assert_eq!(poll.no_votes, 0);
        assert_eq!(get_total_votes(&poll), 0);
    }
}