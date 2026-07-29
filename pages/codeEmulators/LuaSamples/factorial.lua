-- Factorial sample

local function factorial(n)
    if n <= 1 then
        return 1
    end
    return n * factorial(n - 1)
end

for i = 1, 10 do
    print(i .. "! = " .. factorial(i))
end
