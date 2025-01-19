export const idlFactory = ({ IDL }: { IDL: any }) => {
    const Result = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
    const CreateMemeTokenArg = IDL.Record({
        twitter: IDL.Opt(IDL.Text),
        logo: IDL.Text,
        name: IDL.Text,
        description: IDL.Text,
        website: IDL.Opt(IDL.Text),
        telegram: IDL.Opt(IDL.Text),
        symbol: IDL.Text,
    });
    const MemeToken = IDL.Record({
        id: IDL.Nat64,
        creator: IDL.Text,
        available_token: IDL.Nat,
        twitter: IDL.Opt(IDL.Text),
        volume_24h: IDL.Nat,
        logo: IDL.Text,
        name: IDL.Text,
        liquidity: IDL.Float64,
        description: IDL.Text,
        created_at: IDL.Nat64,
        website: IDL.Opt(IDL.Text),
        last_tx_time: IDL.Nat64,
        canister: IDL.Opt(IDL.Text),
        market_cap_icp: IDL.Nat,
        market_cap_usd: IDL.Float64,
        price: IDL.Float64,
        telegram: IDL.Opt(IDL.Text),
        symbol: IDL.Text,
    });
    const Result_1 = IDL.Variant({ Ok: MemeToken, Err: IDL.Text });
    const Transaction = IDL.Record({
        token_amount: IDL.Nat,
        token_id: IDL.Nat64,
        token_symbol: IDL.Text,
        from: IDL.Text,
        timestamp: IDL.Nat64,
        icp_amount: IDL.Nat,
        tx_type: IDL.Text,
    });
    const CreateCommentArg = IDL.Record({
        token: IDL.Text,
        content: IDL.Text,
        image: IDL.Opt(IDL.Text),
    });
    const Sort = IDL.Variant({
        CreateTimeDsc: IDL.Null,
        LastTradeDsc: IDL.Null,
        MarketCapDsc: IDL.Null,
    });
    const Candle = IDL.Record({
        low: IDL.Float64,
        high: IDL.Float64,
        close: IDL.Float64,
        open: IDL.Float64,
        timestamp: IDL.Nat64,
    });
    const Comment = IDL.Record({
        creator: IDL.Text,
        token: IDL.Text,
        content: IDL.Text,
        created_at: IDL.Nat64,
        image: IDL.Opt(IDL.Text),
    });
    const Holder = IDL.Record({ balance: IDL.Nat, owner: IDL.Text });
    const User = IDL.Record({
        principal: IDL.Text,
        name: IDL.Text,
        last_login_seconds: IDL.Nat64,
        register_at_second: IDL.Nat64,
        avatar: IDL.Text,
    });
    const MemeTokenView = IDL.Record({
        token: MemeToken,
        balance: IDL.Nat,
    });
    const WalletReceiveResult = IDL.Record({ accepted: IDL.Nat64 });
    return IDL.Service({
        buy: IDL.Func([IDL.Nat64, IDL.Float64], [Result], []),
        calculate_buy: IDL.Func([IDL.Nat64, IDL.Float64], [Result], ["query"]),
        calculate_sell: IDL.Func([IDL.Nat64, IDL.Float64], [Result], ["query"]),
        create_token: IDL.Func([CreateMemeTokenArg], [Result_1], []),
        king_of_hill: IDL.Func([], [IDL.Opt(MemeToken)], ["query"]),
        last_txs: IDL.Func([IDL.Nat64], [IDL.Vec(Transaction)], ["query"]),
        post_comment: IDL.Func([CreateCommentArg], [], []),
        query_all_tokens: IDL.Func(
            [IDL.Nat64, IDL.Nat64, IDL.Opt(Sort)],
            [IDL.Vec(MemeToken), IDL.Nat64],
            ["query"]
        ),
        query_token: IDL.Func([IDL.Nat64], [IDL.Opt(MemeToken)], ["query"]),
        query_token_candle: IDL.Func(
            [IDL.Nat64, IDL.Opt(IDL.Nat64)],
            [IDL.Vec(Candle)],
            ["query"]
        ),
        query_token_comments: IDL.Func(
            [IDL.Principal, IDL.Nat64, IDL.Nat64],
            [IDL.Vec(Comment), IDL.Nat64],
            ["query"]
        ),
        query_token_holders: IDL.Func(
            [IDL.Nat64, IDL.Nat64, IDL.Nat64],
            [IDL.Vec(Holder), IDL.Nat64],
            ["query"]
        ),
        query_token_transactions: IDL.Func(
            [IDL.Nat64, IDL.Nat64, IDL.Nat64],
            [IDL.Vec(Transaction), IDL.Nat64],
            ["query"]
        ),
        query_user: IDL.Func([IDL.Opt(IDL.Principal)], [User], ["query"]),
        query_user_launched: IDL.Func(
            [IDL.Opt(IDL.Principal)],
            [IDL.Vec(MemeToken)],
            ["query"]
        ),
        query_user_tokens: IDL.Func(
            [IDL.Opt(IDL.Principal)],
            [IDL.Vec(MemeTokenView)],
            ["query"]
        ),
        sell: IDL.Func([IDL.Nat64, IDL.Float64], [Result], []),
        wallet_balance: IDL.Func([], [IDL.Nat], ["query"]),
        wallet_receive: IDL.Func([], [WalletReceiveResult], []),
    });
};
