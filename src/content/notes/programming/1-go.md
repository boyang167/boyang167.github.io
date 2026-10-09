---
title: Basic Concept
description: 'Do not communicate by sharing memory; instead, share memory by communicating.'
date: '2025-05-27'
area: Programming
tags: []
language: zh-CN
order: 1
draft: false
---
# Basic Concept

Do not communicate by sharing memory; instead, share memory by communicating.

不要通过共享内存来通信，而应通过通信来共享内存。

更高层次的并发编程哲学(通过管道来传值是Go语言推荐的做法)。虽然像引用计数这类简单的并发问题通过原子操作或互斥锁就能很好地实现，但是通过Channel来控制访问能够让你写出更简洁正确的程序。

## channel

```go
//create no chache channel 
ch := make(chan, int)
// create channel with cache
chCahe :=make(chan int , 10)
// send v to ch
ch <- v
// receive value from the channel ch 
v:= <-ch


```

### **unbuffered channels**

unbuffered channels are synchonous in their send and receive operations.  A send operation on an unbuffered channel block until another goroutine receives from the channel , and a receive operation blocks until another goroutine sends to the channel.

```go
package main

import (
	"fmt"
	"time"
)

func sender(ch chan int) {
	time.Sleep(3 * time.Second)
	fmt.Println("befor Sent 42 to the channel")
	ch <- 42
	time.Sleep(3 * time.Second) // don't execuation 
	fmt.Println("after Sent 42 to the channel")
}

func main() {
	ch := make(chan int)
	go sender(ch)
	value := <-ch
	fmt.Println("Received", value, "from the channel")
}
```

### buffered channels

buffered channels allow non-blocking send operationas as long as the buffer is not full , and non-blocking receive operations as long as the buffer is not empty.  A send operation blocks when the buffer is full, and

receive opeartion blocks when the buffer us empty.

```go
package main

import "fmt"

func main() {
	ch := make(chan int, 2)
	ch <- 1
	ch <- 2
	ch <- 1
	fmt.Println("Sent two values to the channel")
	fmt.Println("Received", <-ch)
	fmt.Println("Received", <-ch)   //fatal error: all goroutines are asleep - deadlock!

}

func main() {
	ch := make(chan int, 2)
	ch <- 1
	fmt.Println("Sent two values to the channel")
	fmt.Println("Received", <-ch)
	fmt.Println("Received", <-ch)   //fatal error: all goroutines are asleep - deadlock!

}

func main() {
	ch := make(chan int, 2)
	ch <- 1
	ch <- 2
	fmt.Println("Sent two values to the channel")
	fmt.Println("Received", <-ch)
	fmt.Println("Received", <-ch)   

}

```

### Closing a Channel

you can close a channel using the close function. once a channel is closed, you cannot send values to it, but you can still receive values from it .

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 2)
    ch <- 1
    ch <- 2
    close(ch)
    for value := range ch {
        fmt.Println("Received", value)
    }
}
```

### one-way channel

in go, you can also define one-way channels, which are channel that can only send or only receive values.

this helps imporve the readability and security of the code .

```go
package main

import "fmt"

// A send - only channel
func sendOnly(ch chan<- int) {
    ch <- 42
}

// A receive - only channel
func receiveOnly(ch <-chan int) {
    fmt.Println("Received", <-ch)
}

func main() {
    ch := make(chan int)
    go sendOnly(ch)
    receiveOnly(ch)
}
```

### select

the select statement allows a goroutine to wait on muitiple channel opeations simultaneously . when one of the channel opeations is ready, the corresponding case is executed.

```go
    package main
    import (
        "fmt"
        "time"
    )
    func addNumberToChan(chanName chan int) {
        for {
            chanName <- 1
            time.Sleep(1 * time.Second)
        }
    }
    func main() {
        var chan1 = make(chan int, 10)
        var chan2 = make(chan int, 10)
        go addNumberToChan(chan1)
        go addNumberToChan(chan2)
        for {
            select {
            case e := <- chan1 :
                fmt.Printf("Get element from chan1: %d\n", e)
            case e := <- chan2 :
                fmt.Printf("Get element from chan2: %d\n", e)
            default:
                fmt.Printf("No element in chan1 and chan2.\n")
                time.Sleep(1 * time.Second)
            }
        }
    }
```

### range

1. `for...range` 读取 `channel` 的基本用法

使用 `for...range` 循环读取 `channel` 时，每次循环都会从 `channel` 接收一个值，直至 `channel` 被关闭

2. 阻塞机制

当 `channel` 里没有数据时，`for...range` 循环会阻塞当前的 `goroutine`，直至有新的数据被发送到 `channel` 或者 `channel` 被关闭。这和直接使用 `<-ch` 操作符从 `channel` 接收数据时的阻塞机制是一样的。

3. 处理 `channel` 关闭的情况

当 `channel` 被关闭且缓冲区里没有剩余数据时，`for...range` 循环会自动结束，不会引发阻塞。这是 `for...range` 循环处理 `channel` 的一个重要特性，它能帮助我们更简洁地处理 `channel` 的关闭情况。

4. 与数组遍历的区别

虽然 `for...range` 循环在处理 `channel` 和数组时看起来很相似，但它们本质上是不同的。数组的元素是预先存在于内存中的，而 `channel` 是用于在不同 `goroutine` 之间进行异步数据传递的。`channel` 可以在运行时动态地接收和发送数据...

## slice

A slice is a dynamically-sized, flexible view into the elements of arrary. Unlike arrays, which have a fixed lengthm slices can grow and shrink as needed. A slices is represented by a struct that contains three fields: a pointer to the undelying array, the length of the slice, and the capacity of the slice .//

```go
//creating an empty slice:
var s [] int
//creating a slice with inital values 
s :=[] int {1,2,3,4}
// creating a slice from an array 
arr := [5] int {1,2,3,4,5}
s := arr[1:3]
//creating a slice with length 5 and capacity 10
s := make([] int, 5,10)
fmt.Println("Length:", len(s)) // Output: 5
fmt.Println("Capacity:", cap(s)) // Output: 10
//appending elements
s = append(s, 4, 5)
//Slicing a Slice
s := []int{1, 2, 3, 4, 5}
newSlice := s[1:3]
fmt.Println(newSlice) // Output: [2 3]

//iterating over a slice 
s := []int{1, 2, 3, 4, 5}
// Using a for loop
for i := 0; i < len(s); i++ {
    fmt.Println(s[i])
}

// Using a for...range loop
for index, value := range s {
    fmt.Printf("Index: %d, Value: %d\n", index, value)
}

//nil slice 
var s []int
if s == nil {
    fmt.Println("The slice is nil")
}

// copying slice 

src := []int{1, 2, 3, 4, 5}
dst := make([]int, len(src))
n := copy(dst, src)
fmt.Println("Number of elements copied:", n)
fmt.Println(dst) // Output: [1 2 3 4 5]

```

扩容容量的选择遵循以下规则：

* 如果原Slice容量小于1024，则新Slice容量将扩大为原来的2倍；
* 如果原Slice容量大于等于1024，则新Slice容量将扩大为原来的1.25倍；
* 每个切片都指向一个底层数组
* 每个切片都保存了当前切片的长度、底层数组可用容量
* 使用len()计算切片长度时间复杂度为O(1)，不需要遍历切片
* 使用cap()计算切片容量时间复杂度为O(1)，不需要遍历切片
* 通过函数传递切片时，不会拷贝整个切片，因为切片本身只是个结构体而矣
* 使用append()向切片追加元素时有可能触发扩容，扩容后将会生成新的切片

. 编程Tips

* 创建切片时可跟据实际需要预分配容量，尽量避免追加过程中扩容操作，有利于提升性能；
* 切片拷贝时需要判断实际拷贝的元素个数
* 谨慎使用多个切片操作同一个数组，以防读写冲突

## map

Golang的map使用哈希表作为底层实现，一个哈希表里可以有多个哈希表节点，也即bucket，而每个bucket就保存了map中的一个或一组键值对。

## reflect

reflect 包提供了运行时的反射弧机制，能在运行时检查变量的类型，值，还能调用方法，修改字段等。

应用场景：

1. 序列化和反序列化
2. 实现通用的函数和库
3. 动态调用方法
4. 框架开发，反射可用帮助实现插件系统，依赖注入等功能
5. 数据验证

usage：

1. 获取变量的类型和值：

   1. reflect.TypeOf()
   2. reflect.ValueOf())
2. 检查变量类型

   kind() 方法检查变量基本类型

   ```go
   package main

   import (
       "fmt"
       "reflect"
   )

   func main() {
       num := 42
       numValue := reflect.ValueOf(num)
       // 获取变量的基本类型
       kind := numValue.Kind()

       if kind == reflect.Int {
           fmt.Println("The variable is an integer.")
       }
   }
   ```
3. update variable value

   若要修改变量的值，需传入变量的指针，然后使用 `Elem` 方法获取指针指向的值。

   ```go
   package main

   import (
       "fmt"
       "reflect"
   )

   func main() {
       num := 42
       // 获取变量的指针值
       numPtr := reflect.ValueOf(&num)
       // 获取指针指向的值
       numValue := numPtr.Elem()

       if numValue.CanSet() {
           // 设置新的值
           numValue.SetInt(100)
       }

       fmt.Printf("New value: %d\n", num)
   }
   ```
4. 调用结构体方法

   可以使用反射来调用结构体的方法。

```go
package main

import (
    "fmt"
    "reflect"
)

type Person struct {
    Name string
}

func (p Person) SayHello() {
    fmt.Printf("Hello, my name is %s\n", p.Name)
}

func main() {
    person := Person{Name: "John"}
    // 获取结构体的值
    personValue := reflect.ValueOf(person)
    // 获取方法
    method := personValue.MethodByName("SayHello")

    if method.IsValid() {
        // 调用方法
        method.Call(nil)
    }
}
```

5. 遍历结构体的字段

可以使用反射来遍历结构体的字段。

```go
package main

import (
    "fmt"
    "reflect"
)

type Person struct {
    Name string
    Age  int
}

func main() {
    person := Person{Name: "John", Age: 30}
    // 获取结构体的类型
    personType := reflect.TypeOf(person)
    // 获取结构体的值
    personValue := reflect.ValueOf(person)

    for i := 0; i < personType.NumField(); i++ {
        // 获取字段
        field := personType.Field(i)
        // 获取字段的值
        value := personValue.Field(i)

        fmt.Printf("Field name: %s, Field type: %v, Field value: %v\n", field.Name, field.Type, value.Interface())
    }
}
```

## sync

### sync.WaitGroup

sync.WaitGroup来实现并发任务的同步

| 方法名                          | 功能                |
| ------------------------------- | ------------------- |
| (wg * WaitGroup) Add(delta int) | 计数器+delta        |
| (wg *WaitGroup) Done()          | 计数器-1            |
| (wg *WaitGroup) Wait()          | 阻塞直到计数器变为0 |

sync.WaitGroup内部维护着一个计数器，计数器的值可以增加和减少。例如当我们启动了N
个并发任务时，就将计数器值增加N。每个任务完成时通过调用Done()方法将计数器减1。通过调用Wait()来等待并发任务执行完，当计数器值为0时，表示所有并发任务已经完成。

### sync.Once

在编程的很多场景下,需要确保某些操作在高并发的场景下只执行一次，例如只加载一次配置文件、只关闭一次通道等。

### sync.Map

### **`sync.Mutex`**

### sync.pool

- put
- get
- New

使用场景：

1. 频繁创建和销毁对象
2. 高并发

在高并发场景下，频繁的内存分配和释放可能会导致性能瓶颈。`sync.Pool` 可以在多个 goroutine 之间安全地共享对象，减少内存碎片和垃圾回收的压力

3. 昂贵的对象创建

如果对象的创建成本很高，例如数据库连接、网络连接、文件句柄等，使用 `sync.Pool` 可以复用这些对象，减少创建和销毁的开销。

1. 指定New 方法
2. Get 从对象池中获取对象，进行类型断言
3. Put 将对象还回对象池 ，记得重置状态

```go
package main

import (
    "fmt"
    "sync"
)

type DatabaseConnection struct {
    // 数据库连接的字段
    ConnectionString string
}

func newDatabaseConnection() interface{} {
    // 模拟创建数据库连接的昂贵操作
    fmt.Println("Creating new database connection...")
    return &DatabaseConnection{
        ConnectionString: "example_connection_string",
    }
}

var dbConnectionPool = sync.Pool{
    New: newDatabaseConnection,
}

func performDatabaseQuery() {
    // 从池中获取数据库连接
    conn := dbConnectionPool.Get().(*DatabaseConnection)
    defer dbConnectionPool.Put(conn)

    // 使用数据库连接执行查询
    fmt.Println("Performing database query using connection:", conn.ConnectionString)
}

func main() {
    for i := 0; i < 5; i++ {
        performDatabaseQuery()
    }
}
```

### sync.Cond

条件变量在并发编程中用于使一个或多个线程（协程）阻塞地等待一个目标条件被满足，当条件被改变时，可以唤醒一个或多个被阻塞的线程（协程）

是一个用于在多个goroutine之间进行同步和通信的重要工具，可以让 Goroutine 在满足特定条件时被阻塞和唤醒

`每个`Cond `关联一个`Locker `通常是一个`Mutex `或`RWMutex根据需求初始化不同的锁。

sync.Cond 提供了三个方法：Wait()、Signal()、Broadcast()，它们的用法如下：

* Wait()：阻塞当前的 goroutine，等待唤起。
* Signal()：唤起一个阻塞的 goroutine。
* Broadcast()：唤起所有阻塞的 goroutine。

### atomic

代码中的加锁操作因为涉及内核态的上下文切换会比较耗时、代价比较高。针对基本数据类型我们还可以使用原子操作来保证并发安全，因为原子操作是Go语言提供的方法它在用户态就可以完成，因此性能比加锁操作更好。Go语言中原子操作由内置的标准库sync/atomic提供。

| 方法                                                                                                                                                                                                                                                                                                                                                                                         | 解释           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| func LoadInt32(addr *int32) (val int32)<br />func LoadInt64(addr `* int64`) (val int64)<br />func LoadUint32(addr `*uint32`) (val uint32)<br />func LoadUint64(addr `*uint64`) (val uint64)<br />func LoadUintptr(addr `*uintptr`) (val uintptr)<br />func LoadPointer(addr `*unsafe.Pointer`) (val unsafe.Pointer)                                                                | 读取操作       |
| func StoreInt32(addr `*int32`, val int32)<br />``func StoreInt64(addr `*int64`, val int64)``<br />func StoreUint32(addr `*uint32`, val uint32)<br />func StoreUintptr(addr `*uintptr`, val uintptr)*unsafe.Pointer`, val unsafe.Pointer)                                                                                                                                               | 写入操作       |
| func AddInt32(addr `*int32`, delta int32) (new int32)<br />``func AddInt64(addr `*int64`, delta int64) (new int64)``<br />func AddUint32(addr `*uint32`, delta uint32) (new uint32)func AddUintptr(addr `*uintptr`, delta uintptr) (new uintptr)                                                                                                                                       | 修改操作       |
| func SwapInt32(addr `*int32`, new int32) (old int32)<br />``func SwapInt64(addr `*int64`, new int64) (old int64)``<br />func SwapUint32(addr `*uint32`, new uint32) (old uint32)<br />``func SwapUint64(addr `*uint64`, new uint64) (old uint64)``func SwapUintptr(addr `*uintptr`, new uintptr) (old uintptr)*unsafe.Pointer`, new unsafe.Pointer) (old unsafe.Pointer)               | 交换操作       |
| func CompareAndSwapInt32(addr `*int32`, old, new int32) (swapped bool)<br />``func CompareAndSwapInt64(addr `*int64`, old, new int64) (swapped bool)``<br />func CompareAndSwapUint32(addr `*uint32`, old, new uint32) (swapped bool)<br />func CompareAndSwapUintptr(addr `*uintptr`, old, new uintptr) (swapped bool)`br`*unsafe.Pointer`, old, new unsafe.Pointer) (swapped bool) | 比较并交换操作 |

* **`LoadInt32`、`LoadInt64`、`LoadUint32`、`LoadUint64` 等**

  * **功能** ：原子性地加载指定整数变量的值。
  * **使用场景** ：当需要在多线程环境中读取共享整数变量的值时，使用这些函数可以确保读取到的值是最新的、一致的，避免读到中间状态的值。
* **`StoreInt32`、`StoreInt64`、`StoreUint32`、`StoreUint64` 等**

  * **功能** ：原子性地将指定的值存储到整数变量中。
  * **使用场景** ：当需要在多线程环境中修改共享整数变量的值时，使用这些函数可以确保修改操作的原子性，避免其他线程读到不一致的值。

原子操作与互斥锁的比较

* **原子操作** ：
* 优点：性能高，因为原子操作是由 CPU 指令直接支持的，不需要进行上下文切换和锁的管理。
* 缺点：功能相对有限，只能对一些基本类型（如整数、指针）进行原子操作，并且操作比较简单（如加法、比较并交换等）。
* **互斥锁（`sync.Mutex`）** ：
* 优点：功能强大，可以对任意类型的共享资源进行保护，支持复杂的操作。
* 缺点：性能相对较低，因为在加锁和解锁时需要进行上下文切换，可能会导致线程阻塞。

## time.Ticker

## Context

`context` 包是非常重要的，它能够在不同的 Go 协程（goroutine）之间传递请求范围的数据、取消信号以及截止时间等信息

### context.WithValue

### context.WithTimeout

### context.WithCancel

# go 性能分析

1. shell 内置time 指令
   time go run test.go

* `real`：从程序开始到结束，实际度过的时间；
* `user`：程序在**用户态**度过的时间；
* `sys`：程序在**内核态**度过的时间。

一般情况下 `real` **>=** `user` + `sys`，因为系统还有其它进程(切换其他进程中间对于本进程会有空白期)。

2. /usr/bin/time指令

   这个指令比内置的time更加详细一些，使用的时候需要用绝对路径，而且要加上参数 `-v`  ,除了之前的信息外，还包括了：

* CPU占用率；
* 内存使用情况；
* Page Fault 情况；
* 进程切换情况；
* 文件系统IO；
* Socket 使用情况；

# ants

是否预分配协程数量PreAlloc：

* **预分配模式（`PreAlloc` 为 `true`）**
  * **场景** ：当你能够大致预估应用程序在运行时需要的协程数量时，就可以使用预分配模式。例如，在一个处理固定数量并发任务的系统中，像批量数据处理任务，每个任务都需要一个协程来处理，此时可以预先分配好足够数量的协程，避免在运行时动态创建协程带来的延迟。
  * **代码逻辑** ：当 `p.options.PreAlloc` 为 `true` 时，代码会检查预分配的大小 `size` 是否合法（不为 `-1`），若合法则创建一个指定大小的循环队列类型的工作队列。循环队列适合按顺序处理任务，并且可以循环利用队列空间，保证资源的有效利用。
* **动态分配模式（`PreAlloc` 为 `false`）**
  * **场景** ：在无法准确预估并发任务数量的场景下，使用动态分配模式会更加合适。例如，在一个 Web 服务器中，每个客户端请求都可能需要一个协程来处理，而请求的数量是动态变化的。此时，不需要预先分配大量的协程，而是根据实际的请求情况动态创建和管理协程。
  * **代码逻辑** ：当 `p.options.PreAlloc` 为 `false` 时，代码会创建一个初始大小为 `0` 的栈类型工作队列。栈类型的队列可以方便地实现后进先出（LIFO）的任务处理顺序，并且在任务数量动态变化时可以灵活地添加和移除协程。

https://github.com/panjf2000/ants/blob/v2.11.2/README_ZH.md

https://cloud.tencent.com/developer/article/1839614?policyId=1004

https://www.bookstack.cn/read/golang101-1.23/xhtml-basic-types-and-value-literals.xhtml

https://www.youngergo.cn/en/posts/tech/go-ants/

https://darjun.github.io/2021/06/03/godailylib/ants/

https://darjun.github.io/2021/06/03/godailylib/ants/

## basic

Go支持如下内置基本类型：

* 一种内置布尔类型：`bool`。
* 11种内置整数类型：`int8`、`uint8`、`int16`、`uint16`、`int32`、`uint32`、`int64`、`uint64`、`int`、`uint`和 `uintptr`。
* 两种内置浮点数类型：`float32`和 `float64`。
* 两种内置复数类型：`complex64`和 `complex128`。
* 一种内置字符串类型：`string`。

Go中有两种内置类型别名（type alias）：

* `byte`是 `uint8`的内置别名。 我们可以将 `byte`和 `uint8`看作是同一个类型。
* `rune`是 `int32`的内置别名。 我们可以将 `rune`和 `int32`看作是同一个类型。

# net

Go 语言的 `net` 包提供了构建网络应用程序所需的基本功能，涵盖了 TCP、UDP、HTTP 等多种网络协议

在网络编程中，监听器（Listener）主要用于等待和接收传入的网络连接请求，以下是关于监听器用途的详细介绍：

### 1. 等待连接请求

* **被动等待** ：监听器就像一个在特定端口 “站岗” 的角色。例如，在一个 HTTP 服务器中，监听器会在指定的 IP 地址和端口（如 `localhost:8080`）上等待客户端（如浏览器）发送的连接请求。它不会主动发起连接，而是处于一种等待状态，直到有外部的连接尝试到达指定端口。
* **开启服务端口** ：通过绑定到特定端口，监听器开启了一个服务端口，使得服务器能够在网络上被访问。这是服务器能够提供服务的基础，比如 Web 服务器监听 80 端口（HTTP）或 443 端口（HTTPS），邮件服务器监听 25 端口（SMTP）等，不同的服务通过不同的端口监听来接收对应的请求。

### 2. 建立连接

* **接收连接请求并创建连接** ：当监听器检测到一个连接请求时，它会负责与客户端建立连接。这个连接建立过程涉及到网络协议的握手阶段。以 TCP 协议为例，会进行三次握手操作，监听器在这个过程中扮演服务器端的角色，与客户端完成握手后，为后续的数据传输建立一个可靠的连接通道。
* **分配资源给连接** ：在连接建立后，监听器会为这个新连接分配必要的资源，如内存空间用于存储连接相关的状态信息，包括连接双方的 IP 地址、端口号、连接的状态（如是否正在传输数据、是否空闲等）。这些资源分配确保了连接能够正常地进行数据的接收和发送。

### 3. 连接管理

* **跟踪连接状态** ：监听器可以跟踪连接的状态，例如是否处于活动状态、是否已经关闭等。这对于服务器进行有效的资源管理和安全监控非常重要。例如，当一个连接长时间处于空闲状态（通过设置 `IdleTimeout`），服务器可以决定是否关闭这个连接，以释放资源。
* **支持多连接处理** ：能够同时监听多个连接请求，使得服务器可以同时服务多个客户端。例如，一个 Web 服务器可以同时处理多个用户的浏览器请求，这是通过监听器的异步处理机制或者多线程 / 多进程模型实现的。当有新的连接请求到达时，监听器可以将其放入一个等待处理的队列，然后由服务器的其他部分（如处理请求的线程或进程）按照一定的顺序进行处理。

### 4. 协议适配

* **适配不同网络协议** ：不同的网络协议（如 TCP、UDP）有不同的监听方式和连接建立过程。监听器能够根据服务器所使用的协议，正确地处理连接请求。例如，TCP 监听器会确保连接的可靠性，而 UDP 监听器则侧重于快速的数据报接收，不保证数据传输的顺序和可靠性。
* **支持协议升级** ：在一些复杂的网络服务中，监听器还可以支持协议的升级。例如，在 HTTP/1.1 到 HTTP/2 的升级过程中，监听器可以识别协议升级请求，并按照相应的规则进行处理，以实现更高效的通信。

# net/http

Clinet -> Requests ->  [Multiplexer(router) -> handler  -> Response -> Clinet

Golang中的Multiplexer基于 `ServeMux`结构，同时也实现了 `Handler`接口

* hander函数： 具有func(w http.ResponseWriter, r *http.Requests)签名的函数
* handler处理器(函数): 经过HandlerFunc结构包装的handler函数，它实现了ServeHTTP接口方法的函数。调用handler处理器的ServeHTTP方法时，即调用handler函数本身。
* handler对象：实现了Handler接口ServeHTTP方法的结构。

请求体参数：

1. 表单  对应的Content-Type是application/x-www-form-urlencoded
2. json  对应的Content-Type是application/json
3. 包含文件的表单 对应的Content-Type是multipart/form-data

Cookie

`net/http`自带了cookiejar, 不过这个只能保存在内存中，如果需要持久化，需要使用第三方的cookieJar, 比如 `github.com/juju/persistent-cookiejar`

超时：

![1745030613300](/knowledge-assets/programming/image/1-go/1745030613300.png)

SSL 证书

代理

编码

```go
type ServeMux struct {
	mu    sync.RWMutex  //
	m     map[string]muxEntry //路由表
	es    []muxEntry // slice of entries sorted from longest to shortest.
	hosts bool       // whether any patterns contain hostnames
}

type muxEntry struct {
    h        Handler // 处理程序
    pattern  string  // 路由路径  实际上和路由表中的key相同
}
```

m是路由表，路由表本质上就是一个 `map[string]muxEntry`变量，键是路径字符串（由method和传入参数拼接字符串组成），值是对应的处理结构体 `muxEntry`

![1744900852251](/knowledge-assets/programming/image/1-go/1744900852251.png)

https://youerning.top/post/go-http-code-reading/

https://blog.engine.wang/posts/net-http-source-code/

go web 框架

https://github.com/youerning/blog/tree/master/fast-admin

https://blog.engine.wang/posts/distribution-system-1/

# database/sql

# Gorm

python :sqlAlchemt , DjiangoORM

java: Hibernate, Mybatis

Goland: GORM

## CRUD

### Create

```go
type Model struct{}
}
//1 create 
db.Create($Model{})
// 2.  Batch create
db.CreateInBatches(models,100)
// 3. Upsert

// 4. Create With Association

// 5. create hooks 
// gorm 允许用户通过实现接口， BeforeSave,BeforCreate,AfterSave,AfterCreate 来自定义
// 钩子，这些钩子在创建一条记录的时候会被调用
func ( m *Model) BeforeCreate(tx *gorm.DB)(err error){
	//logic  
}
//如果你想跳过Hooks方法，可以使用SkipHooks会话模式，例子如下
DB.Session(&gorm.Session{SkipHooks: true}).Create(&Model)
DB.Session(&gorm.Session{SkipHooks: true}).Create(&Models)
DB.Session(&gorm.Session{SkipHooks: true}).CreateInBatches(Model, 100)

// 6. Create By Map
//GORM支持通过 map[string]interface{} 与 []map[string]interface{}{}来创建记录。
db.Model(&User{}).Create(map[string]interface{}{
  "Name": "jinzhu", "Age": 18,
})

// batch insert from `[]map[string]interface{}{}`
db.Model(&User{}).Create([]map[string]interface{}{
  {"Name": "jinzhu_1", "Age": 18},
  {"Name": "jinzhu_2", "Age": 20},
})

 //注意当使用map来创建时，钩子方法不会执行，关联不会被保存且不会回写主键。

//7. 使用 SQL 表达式、Context Valuer 创建记录

//8. 关联创建
//创建关联数据时，如果关联值非零，这些关联会被upsert，并且它们的Hooks方法也会被调用。

//通过Select, Omit方法来跳过关联更新，示例如下：
db.Omit("CreditCard").Create(&user)
// skip all associations
db.Omit(clause.Associations).Create(&user)

//在 GORM 中，db.Omit 用于在创建、更新或查询操作中排除指定的字段

//db.Clauses 方法为 GORM 提供了强大的扩展性，你可以通过它添加各种自定义的 SQL 子句来满足复杂的查询和操作需求。但使用时要注意不同数据库对 SQL 子句的支持情况


```

### Query

```go
//1. 获取第一条记录（主键升序）
db.First(&user)
// SELECT * FROM users ORDER BY id LIMIT 1;

//2. 获取一条记录，没有指定排序字段
db.Take(&user)
// SELECT * FROM users LIMIT 1;

// 3. 获取最后一条记录（主键降序）
db.Last(&user)
// SELECT * FROM users ORDER BY id DESC LIMIT 1;
result := db.First(&user)
result.RowsAffected // 返回找到的记录数
result.Error 
//4. 检查 ErrRecordNotFound 错误
errors.Is(result.Error, gorm.ErrRecordNotFound)

//5. 检索全部对象
result := db.Find(&users)
// SELECT * FROM users;

result.RowsAffected // returns found records count, equals `len(users)`
result.Error        // returns error

//6. 条件
String 条件
// Get first matched record
db.Where("name = ?", "jinzhu").First(&user)
// SELECT * FROM users WHERE name = 'jinzhu' ORDER BY id LIMIT 1;

// Get all matched records
db.Where("name <> ?", "jinzhu").Find(&users)
// SELECT * FROM users WHERE name <> 'jinzhu';

// IN
db.Where("name IN ?", []string{"jinzhu", "jinzhu 2"}).Find(&users)
// SELECT * FROM users WHERE name IN ('jinzhu','jinzhu 2');

// LIKE
db.Where("name LIKE ?", "%jin%").Find(&users)
// SELECT * FROM users WHERE name LIKE '%jin%';

// AND
db.Where("name = ? AND age >= ?", "jinzhu", "22").Find(&users)
// SELECT * FROM users WHERE name = 'jinzhu' AND age >= 22;

// Time
db.Where("updated_at > ?", lastWeek).Find(&users)
// SELECT * FROM users WHERE updated_at > '2000-01-01 00:00:00';

// BETWEEN
db.Where("created_at BETWEEN ? AND ?", lastWeek, today).Find(&users)
// SELECT * FROM users WHERE created_at BETWEEN '2000-01-01 00:00:00' AND '2000-01-08 00:00:00';

//7. Struct & Map 条件
// Struct
db.Where(&User{Name: "jinzhu", Age: 20}).First(&user)
// SELECT * FROM users WHERE name = "jinzhu" AND age = 20 ORDER BY id LIMIT 1;

// Map
db.Where(map[string]interface{}{"name": "jinzhu", "age": 20}).Find(&users)
// SELECT * FROM users WHERE name = "jinzhu" AND age = 20;

// Slice of primary keys
db.Where([]int64{20, 21, 22}).Find(&users)
// SELECT * FROM users WHERE id IN (20, 21, 22);

//8. 内联条件
// Get by primary key if it were a non-integer type
db.First(&user, "id = ?", "string_primary_key")
// SELECT * FROM users WHERE id = 'string_primary_key';

// Plain SQL
db.Find(&user, "name = ?", "jinzhu")
// SELECT * FROM users WHERE name = "jinzhu";

db.Find(&users, "name <> ? AND age > ?", "jinzhu", 20)
// SELECT * FROM users WHERE name <> "jinzhu" AND age > 20;

// Struct
db.Find(&users, User{Age: 20})
// SELECT * FROM users WHERE age = 20;

// Map
db.Find(&users, map[string]interface{}{"age": 20})
// SELECT * FROM users WHERE age = 20;

//9. Not 条件
db.Not("name = ?", "jinzhu").First(&user)
// SELECT * FROM users WHERE NOT name = "jinzhu" ORDER BY id LIMIT 1;

// Not In
db.Not(map[string]interface{}{"name": []string{"jinzhu", "jinzhu 2"}}).Find(&users)
// SELECT * FROM users WHERE name NOT IN ("jinzhu", "jinzhu 2");

// Struct
db.Not(User{Name: "jinzhu", Age: 18}).First(&user)
// SELECT * FROM users WHERE name <> "jinzhu" AND age <> 18 ORDER BY id LIMIT 1;

// Not In slice of primary keys
db.Not([]int64{1,2,3}).First(&user)
// SELECT * FROM users WHERE id NOT IN (1,2,3) ORDER BY id LIMIT 1;


//10. Or 条件

db.Where("role = ?", "admin").Or("role = ?", "super_admin").Find(&users)
// SELECT * FROM users WHERE role = 'admin' OR role = 'super_admin';

// Struct
db.Where("name = 'jinzhu'").Or(User{Name: "jinzhu 2", Age: 18}).Find(&users)
// SELECT * FROM users WHERE name = 'jinzhu' OR (name = 'jinzhu 2' AND age = 18);

// Map
db.Where("name = 'jinzhu'").Or(map[string]interface{}{"name": "jinzhu 2", "age": 18}).Find(&users)
// SELECT * FROM users WHERE name = 'jinzhu' OR (name = 'jinzhu 2' AND age = 18);

//11. 选择特定字段
db.Select("name", "age").Find(&users)
// SELECT name, age FROM users;

db.Select([]string{"name", "age"}).Find(&users)
// SELECT name, age FROM users;

db.Table("users").Select("COALESCE(age,?)", 42).Rows()
// SELECT COALESCE(age,'42') FROM users;

//12. 排序
db.Order("age desc, name").Find(&users)
// SELECT * FROM users ORDER BY age desc, name;

// Multiple orders
db.Order("age desc").Order("name").Find(&users)
// SELECT * FROM users ORDER BY age desc, name;

db.Clauses(clause.OrderBy{
  Expression: clause.Expr{SQL: "FIELD(id,?)", Vars: []interface{}{[]int{1, 2, 3}}, WithoutParentheses: true},
}).Find(&User{})
// SELECT * FROM users ORDER BY FIELD(id,1,2,3)

//13. Limit& Offset
db.Limit(3).Find(&users)
// SELECT * FROM users LIMIT 3;

// Cancel limit condition with -1
db.Limit(10).Find(&users1).Limit(-1).Find(&users2)
// SELECT * FROM users LIMIT 10; (users1)
// SELECT * FROM users; (users2)

db.Offset(3).Find(&users)
// SELECT * FROM users OFFSET 3;

db.Limit(10).Offset(5).Find(&users)
// SELECT * FROM users OFFSET 5 LIMIT 10;

// Cancel offset condition with -1
db.Offset(10).Find(&users1).Offset(-1).Find(&users2)
// SELECT * FROM users OFFSET 10; (users1)
// SELECT * FROM users; (users2)

//14. Group By & Having
type result struct {
  Date  time.Time
  Total int
}

db.Model(&User{}).Select("name, sum(age) as total").Where("name LIKE ?", "group%").Group("name").First(&result)
// SELECT name, sum(age) as total FROM `users` WHERE name LIKE "group%" GROUP BY `name` LIMIT 1


db.Model(&User{}).Select("name, sum(age) as total").Group("name").Having("name = ?", "group").Find(&result)
// SELECT name, sum(age) as total FROM `users` GROUP BY `name` HAVING name = "group"

//15 Distinct
db.Distinct("name", "age").Order("name, age desc").Find(&results)

//16. Joins
db.Model(&User{}).Select("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Scan(&result{})

//prejoin
db.Joins("Company").Find(&users)
db.InnerJoins("Company").Find(&users)
db.Joins("Company", db.Where(&Company{Alive: true})).Find(&users)
//17 Scan
var result Result
db.Table("users").Select("name", "age").Where("name = ?", "Antonio").Scan(&result)

// Raw SQL
db.Raw("SELECT name, age FROM users WHERE name = ?", "Antonio").Scan(&result)

 // 将结果映射到 map
  var userMap map[string]interface{}
  db.First(&User{}).Where("id = ?", 1).Scan(&userMap)

    // 将结果映射到基本数据类型
    var userName string
    db.Model(&User{}).Where("id = ?", 1).Pluck("name", &userName)
```

### Advantage Query

智能选择字段

在 GORM 中，您可以使用 [`Select`](https://gorm.io/zh_CN/docs/query.html) 方法有效地选择特定字段。 这在Model字段较多但只需要其中部分的时候尤其有用，比如编写API响应。

```go
type User struct {
  ID     uint
  Name   string
  Age    int
  Gender string
  // 很多很多字段
}

type APIUser struct {
  ID   uint
  Name string
}

// 在查询时，GORM 会自动选择 `id `, `name` 字段
db.Model(&User{}).Limit(10).Find(&APIUser{})
// SQL: SELECT `id`, `name` FROM `users` LIMIT 10
```

Luck

GORM 支持多种类型的锁，例如：

```
// 基本的 FOR UPDATE 锁
db.Clauses(clause.Locking{Strength: "UPDATE"}).Find(&users)
// SQL: SELECT * FROM `users` FOR UPDATE
```

### update

```go

//1. Save 会保存所有的字段，即使字段是零值
//保存 是一个组合函数。 如果保存值不包含主键，它将执行 Create，否则它将执行 Update (包含所有字段)。

//2. 更新单个列
// 根据条件更新
db.Model(&User{}).Where("active = ?", true).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE active=true;

// User 的 ID 是 `111`
db.Model(&user).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111;

// 根据条件和 model 的值进行更新
db.Model(&user).Where("active = ?", true).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111 AND active=true;

// 3.更新多列
//Updates 方法支持 struct 和 map[string]interface{} 参数。当使用 struct 更新时，默认情况下GORM 只会更新非零值的字段

//4. 更新选定字段
db.Model(&user).Select("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})

// 5. update hook
//GORM 支持的 hook 包括：BeforeSave, BeforeUpdate, AfterSave, AfterUpdate. 更新记录时将调用这些方法，查看 Hooks 获取详细信息
func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
    if u.Role == "admin" {
        return errors.New("admin user not allowed to update")
    }
    return
}

//6 批量更新
/// Update with struct/Map

//7: 使用 SQL 表达式更新
// product's ID is `3`
db.Model(&product).Update("price", gorm.Expr("price * ? + ?", 2, 100))
// UPDATE "products" SET "price" = price * 2 + 100, "updated_at" = '2013-11-17 21:34:10' WHERE "id" = 3;

db.Model(&product).Updates(map[string]interface{}{"price": gorm.Expr("price * ? + ?", 2, 100)})
// UPDATE "products" SET "price" = price * 2 + 100, "updated_at" = '2013-11-17 21:34:10' WHERE "id" = 3;

db.Model(&product).UpdateColumn("quantity", gorm.Expr("quantity - ?", 1))
// UPDATE "products" SET "quantity" = quantity - 1 WHERE "id" = 3;

db.Model(&product).Where("quantity > 1").UpdateColumn("quantity", gorm.Expr("quantity - ?", 1))
// UPDATE "products" SET "quantity" = quantity - 1 WHERE "id" = 3 AND quantity > 1;

```

### Delete

```go
//1. delete a row recored 
db.Delete(&email)
//2. 根据主键删除
db.Delete(&User{}, 10)
// 3.hook 
func (u *User) BeforeDelete(tx *gorm.DB) (err error) {
    if u.Role == "admin" {
        return errors.New("admin user not allowed to delete")
    }
    return
}
// batch delete
db.Where("email LIKE ?", "%jinzhu%").Delete(&Email{})
db.Delete(&Email{}, "email LIKE ?", "%jinzhu%")
// 软删除
如果你的模型包含了 gorm.DeletedAt字段（该字段也被包含在gorm.Model中），那么该模型将会自动获得软删除的能力！

当调用Delete时，GORM并不会从数据库中删除该记录，而是将该记录的DeleteAt设置为当前时间，而后的一般查询方法将无法查找到此条记录。
type User struct {
  ID      int
  Deleted gorm.DeletedAt
  Name    string
}
你可以使用Unscoped来查询到被软删除的记录
db.Unscoped().Where("age = 20").Find(&users)
永久删除
db.Unscoped().Delete(&order)
//混合模式可以使用 0，1或者unix时间戳来标记数据是否被软删除，并同时可以保存被删除时间
type User struct {
  ID        uint
  Name      string
  DeletedAt time.Time
  IsDel     soft_delete.DeletedAt `gorm:"softDelete:flag,DeletedAtField:DeletedAt"` // use `1` `0`
  // IsDel     soft_delete.DeletedAt `gorm:"softDelete:,DeletedAtField:DeletedAt"` // use `unix second`
  // IsDel     soft_delete.DeletedAt `gorm:"softDelete:nano,DeletedAtField:DeletedAt"` // use `unix nano second`
}
```

原生SQl

```go
//1. 原生查询 SQL 和 Scan
var result Result
db.Raw("SELECT id, name, age FROM users WHERE id = ?", 3).Scan(&result)
var users []User
db.Raw("UPDATE users SET name = ? WHERE age = ? RETURNING id, name", "jinzhu", 20).Scan(&users)

//2. Exec 原生 SQL
db.Exec("DROP TABLE users")
db.Exec("UPDATE users SET money = ? WHERE name = ?", gorm.Expr("money * ? + ?", 10000, 1), "jinzhu")
```

### DryRun 模式

```markdown
#1 .在不执行的情况下生成 SQL 及其参数，可以用于准备或测试生成的 SQL
stmt := db.Session(&gorm.Session{DryRun: true}).First(&user, 1).Statement
stmt.SQL.String() //=> SELECT * FROM `users` WHERE `id` = $1 ORDER BY `id`
stmt.Vars  

#2. ToSQL
返回生成的 SQL 但不执行
sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
  return tx.Model(&User{}).Where("id = ?", 100).Limit(10).Order("age desc").Find(&[]User{})
})
sql //=> SELECT * FROM "users" WHERE id = 100 AND "users"."deleted_at" IS NULL ORDER BY age desc LIMIT 10
```

## Relationship

### belongs to

```go
type User struct {
  gorm.Model
  Name      string
  CompanyID int
  Company   Company `gorm:"references:CompanyID"` // use Company.CompanyID as references
}

type Company struct {
  CompanyID   int
  Code        string
  Name        string
}
```

### 1:1 has one

```go
type User struct {
  gorm.Model
  Name       string     `gorm:"index"`
  CreditCard CreditCard `gorm:"foreignKey:UserName;references:Name"`
}

type CreditCard struct {
  gorm.Model
  Number   string
  UserName string
}
```

### 1:n has many

```go
type User struct {
  gorm.Model
  MemberNumber string
  CreditCards  []CreditCard `gorm:"foreignKey:UserNumber;references:MemberNumber"`
}

type CreditCard struct {
  gorm.Model
  Number     string
  UserNumber string
}
```

### n:m many to many

```go
type User struct {
    gorm.Model
    Profiles []Profile `gorm:"many2many:user_profiles;foreignKey:Refer;joinForeignKey:UserReferID;References:UserRefer;joinReferences:ProfileRefer"`
    Refer    uint      `gorm:"index:,unique"`
}

type Profile struct {
    gorm.Model
    Name      string
    UserRefer uint `gorm:"index:,unique"`
}

// 会创建连接表：user_profiles
//   foreign key: user_refer_id, reference: users.refer
//   foreign key: profile_refer, reference: profiles.user_refer
```

| 标签               | 作用对象 | 说明                               |
| ------------------ | -------- | ---------------------------------- |
| `foreignKey`     | 当前模型 | 指定当前模型的哪个字段用于关联     |
| `joinForeignKey` | 连接表   | 指定连接表中代表当前模型的外键列名 |
| `references`     | 关联模型 | 指定关联模型的哪个字段用于关联     |
| `joinReferences` | 连接表   | 指定连接表中代表关联模型的外键列名 |

```go
type User struct {
    UID      uint `gorm:"primaryKey"` // 自定义主键名
    Name     string
    // 配置说明:
    // foreignKey:UID - 使用 User 的 UID 字段作为关联字段
    // joinForeignKey:user_uid - 在连接表中使用 user_uid 作为外键列名
    // references:ID - 关联 Language 的 ID 字段
    // joinReferences:lang_id - 在连接表中使用 lang_id 作为外键列名
    Languages []Language `gorm:"many2many:user_languages;foreignKey:UID;joinForeignKey:user_uid;references:ID;joinReferences:lang_id"`
}

type Language struct {
    ID   uint `gorm:"primaryKey"`
    Name string
}

/*
CREATE TABLE user_languages (
  user_uid INT,  -- 由 joinForeignKey 指定
  lang_id INT,   -- 由 joinReferences 指定
  PRIMARY KEY (user_uid, lang_id),
  FOREIGN KEY (user_uid) REFERENCES users(uid),
  FOREIGN KEY (lang_id) REFERENCES languages(id)
);
*/
```

### Join

### context

Single session mode is appropriate for executing individual operations.
It ensures that the specific operation is executed within the context’s
scope, allowing for better control and monitoring.

1. Continuous session mode is ideal for performing a series of related
   operations. It maintains the context across these operations, which is
   particularly useful in scenarios like transactions.

```
tx := db.WithContext(ctx)
tx.First(&user, 1)
tx.Model(&user).Update("role", "admin")
```

2. Context Timeout

```
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

db.WithContext(ctx).Find(&users)
```

3. Integration with Chi Middleware

```go
func SetDBMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    timeoutContext, _ := context.WithTimeout(context.Background(), time.Second)
    ctx := context.WithValue(r.Context(), "DB", db.WithContext(timeoutContext))
    next.ServeHTTP(w, r.WithContext(ctx))
  })
}

// Router setup
r := chi.NewRouter()
r.Use(SetDBMiddleware)

// Route handlers
r.Get("/", func(w http.ResponseWriter, r *http.Request) {
  db, ok := r.Context().Value("DB").(*gorm.DB)
  // ... db operations
})

r.Get("/user", func(w http.ResponseWriter, r *http.Request) {
  db, ok := r.Context().Value("DB").(*gorm.DB)
  // ... db operations
}
```

## chain

Method Categories

GORM 将方法分为三大类： `Chain Methods`, `Finisher Methods`, and `New Session Methods`.

1. 用于修改或追加目前 `Clauses` 的 `Statement`。 一些常见的链式方法包括：

* `Where`
* `Select`
* `Omit`
* `Joins`
* `Scopes`
* `Preload`
* `Raw` (Note: `Raw` cannot be used in conjunction with other chainable methods to build SQL)

2. Finisher Methods

终结方法是即时的，执行生成和运行 SQL 命令的注册回调。 This category includes methods:

* `Create`
* `First`
* `Find`
* `Take`
* `Save`
* `Update`
* `Delete`
* `Scan`
* `Row`
* `Rows`

## Transaction

```go
1. 禁用默认事务

为了确保数据一致性，GORM 会在事务里执行写入操作（创建、更新、删除）。如果没有这方面的要求，您可以在初始化时禁用它，这将获得大约 30%+ 性能提升。

2. transaction
要在事务中执行一系列操作，一般流程如下：
db.Transaction(func(tx *gorm.DB) error {
  // 在事务中执行一些 db 操作（从这里开始，您应该使用 'tx' 而不是 'db'）
  if err := tx.Create(&Animal{Name: "Giraffe"}).Error; err != nil {
    // 返回任何错误都会回滚事务
    return err
  }

  if err := tx.Create(&Animal{Name: "Lion"}).Error; err != nil {
    return err
  }

  // 返回 nil 提交事务
  return nil
})
//3 手动事务
Gorm 支持直接调用事务控制方法（commit、rollback），例如：
// 开始事务
tx := db.Begin()

// 在事务中执行一些 db 操作（从这里开始，您应该使用 'tx' 而不是 'db'）
tx.Create(...)

// ...

// 遇到错误时回滚事务
tx.Rollback()

// 否则，提交事务
tx.Commit()

func CreateAnimals(db *gorm.DB) error {
  // 再唠叨一下，事务一旦开始，你就应该使用 tx 处理数据
  tx := db.Begin()
  defer func() {
    if r := recover(); r != nil {
      tx.Rollback()
    }
  }()

  if err := tx.Error; err != nil {
    return err
  }

  if err := tx.Create(&Animal{Name: "Giraffe"}).Error; err != nil {
     tx.Rollback()
     return err
  }

  if err := tx.Create(&Animal{Name: "Lion"}).Error; err != nil {
     tx.Rollback()
     return err
  }

  return tx.Commit().Error
}


//4 savepoint rollbackto
//GORM 提供了 SavePoint、Rollbackto 方法，来提供保存点以及回滚至保存点功能，例如：
tx := db.Begin()
tx.Create(&user1)

tx.SavePoint("sp1")
tx.Create(&user2)
tx.RollbackTo("sp1") // Rollback user2

tx.Commit() // Commit user1
```

# gorilla

# GoKit

https://deepwiki.com/go-kit/kit

* 传输层 Transport
* 端点层 Endpoint
* 服务层 Service

go-kit 采用三层架构方式，自上而下分别为：Transport、Endpoint、Service。

> 日后开发应严格遵守此规范

1. `Transport`层主要负责与传输协议HTTP，GRPC，THRIFT等相关的逻辑；
2. `Endpoint`层主要负责request／response格式的转换，以及公用拦截器相关的逻辑；Endpoint
   是 go-kit 中最重要的组件之一，它用于封装服务操作的输入和输出。通过
   Endpoint，开发者可以将一个服务拆分成多个小的可复用的操作，这些操作可以独立地进行测试、扩展和部署。
3. `Service`层则专注于业务逻辑，就是我们的业务类、接口等相关信息存放。Service 是业务逻辑的实现，它是 Endpoint 的实现者。Service 负责处理具体的业务逻辑，通过 Endpoint 将其暴露出去供其他服务进行调用。

![1745982927033](/knowledge-assets/programming/image/1-go/1745982927033.png)

```
             +-----------+
    Request -->| Transport |--> Endpoint --> Service
                +-----------+
                    ^
                    |
    Response <------+

// 求从 Transport 组件进入，然后被传递到 Endpoint 组件。Endpoint 组件封装了服务操作的输入和输出，通过调用 Service 组件来处理具体的业务逻辑，并将结果返回给 Endpoint 组件。最后，Endpoint 组件将结果返回给 Transport 组件，由 Transport 组件发送回客户端。
```

## go-kit 构建微服务步骤

1. 定义业务逻辑和数据模型：定义服务接口和数据模型，包括请求和响应数据结构。
2. 实现服务：根据定义的接口和数据模型实现服务，包括服务接口和业务逻辑实现。
3. 创建 endpoint：创建 endpoint 对象，将业务逻辑封装成 endpoint。
4. 创建 transport：创建 transport 对象，处理网络传输，包括编码、解码和传输数据。
5. 创建服务实例：创建服务实例，将 endpoint 和 transport 组装起来，创建服务实例。
6. 创建中间件：创建中间件对象，实现一些通用的逻辑，例如认证、授权、限流、熔断、追踪、日志等。
7. 组装中间件和服务实例：将中间件对象和服务实例组装起来，形成一个完整的服务实例。


## 哪些事情适合在中间件中做

```
compress.go
  => 对http的响应体进行压缩处理
heartbeat.go
  => 设置一个特殊的路由，例如/ping，/healthcheck，用来给负载均衡一类的前置服务进行探活
logger.go
  => 打印请求处理处理日志，例如请求处理时间，请求路由
profiler.go
  => 挂载pprof需要的路由，如`/pprof`、`/pprof/trace`到系统中
realip.go
  => 从请求头中读取X-Forwarded-For和X-Real-IP，将http.Request中的RemoteAddr修改为得到的RealIP
requestid.go
  => 为本次请求生成单独的requestid，可一路透传，用来生成分布式调用链路，也可用于在日志中串连单次请求的所有逻辑
timeout.go
  => 用context.Timeout设置超时时间，并将其通过http.Request一路透传下去
throttler.go
  => 通过定长大小的channel存储token，并通过这些token对接口进行限流
```


Refence:

1. http://docs.pmx.cn:2080/docs/golang/golang-1crffmhefbrj4

# Go-Admin

https://www.topgoer.com/%E9%A1%B9%E7%9B%AE/github%E5%BA%93%E5%9C%B0%E5%9D%80.html

# gin

请求方法： post/get/update/delete

gin 在获取参数的时候，可用使用ShoudBindJSON 解下参数

路由分组

# casbin

{sub, obj, act}

2个配置文件

![1746845899301](/knowledge-assets/programming/image/1-go/1746845899301.png)

![1746846802152](/knowledge-assets/programming/image/1-go/1746846802152.png)

![1746846848485](/knowledge-assets/programming/image/1-go/1746846848485.png)

![1746846913078](/knowledge-assets/programming/image/1-go/1746846913078.png)

![1746846962186](/knowledge-assets/programming/image/1-go/1746846962186.png)

![1746847011411](/knowledge-assets/programming/image/1-go/1746847011411.png)

Best Practices for API Development

When extending the system with new APIs, follow these established patterns:

1. **Group related APIs** : Place related functionality in the same API group
2. **Follow CRUD patterns** : Use standard HTTP methods for operations
3. **Validate input** : Always validate request data
4. **Use service layer** : Implement business logic in service components
5. **Standard responses** : Use the response helper functions
6. **Document with Swagger** : Add Swagger annotations to all endpoints
7. **Secure with Casbin** : Define permission rules for endpoints

文档在语雀

https://boyang168.yuque.com/dashboard/org_wiki
